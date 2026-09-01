"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowLeft,
  Plane,
  User,
  Mail,
  UserCheck,
  AlertTriangle,
  Calendar,
  Box,
  Circle,
  Ship,
  Train,
  ArrowRight,
  CircleCheck,
  CircleAlert,
  CircleDot,
  Ban,
  FileText,
  FileSearch,
  PackageCheck,
  PackageX,
  Warehouse,
  PauseCircle,
  XCircle,
  Undo2,
} from "lucide-react";

import { motion } from "framer-motion";

import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import ApiService from "../utils/api";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// expectedDelivery is a calendar date stored at UTC midnight, so it has to be
// rendered in UTC -- formatting it locally shifts it a day earlier for anyone
// behind UTC.
const formatDeliveryDate = (value) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
};

const formatDateTime = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return (
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const formatTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleTimeString();
};

const hashString = (value) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
};

const DEMO_CITIES = [
  "London, UK",
  "Manchester, UK",
  "Birmingham, UK",
  "Rotterdam, Netherlands",
  "Frankfurt, Germany",
  "New York, USA",
  "Lagos, Nigeria",
];
const DEMO_STATUSES = [
  "Label Created",
  "Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
];
const DEMO_TRANSPORT = ["By Road", "By Air", "By Sea", "By Rail"];

const buildDemoTrackingResult = (number) => {
  const seed = hashString(number);
  const pick = (arr, offset = 0) => arr[(seed + offset) % arr.length];
  const stepCount = 2 + (seed % 3);
  const now = Date.now();

  const progress = Array.from({ length: stepCount }, (_, i) => {
    const timestamp = now - (stepCount - i) * 36 * 60 * 60 * 1000;
    return {
      location: pick(DEMO_CITIES, i * 3),
      date: formatDate(timestamp),
      time: formatTime(timestamp),
      status: pick(DEMO_STATUSES, i),
      current: i === stepCount - 1,
    };
  }).reverse();

  return {
    trackingNumber: number,
    status: pick(DEMO_STATUSES, stepCount - 1),
    origin: pick(DEMO_CITIES, 1),
    destination: pick(DEMO_CITIES, 5),
    transportMode: pick(DEMO_TRANSPORT, 2),
    expectedDelivery: formatDate(now + 2 * 24 * 60 * 60 * 1000),
    shipOutDate: formatDate(now - 3 * 24 * 60 * 60 * 1000),
    currentLocation: pick(DEMO_CITIES, 2),
    sender: { name: "Sender", email: "" },
    receiver: {
      name: "Receiver",
      location: pick(DEMO_CITIES, 5),
      email: "",
    },
    content: "MacBook Pro",
    quantity: 1,
    description: "Apple MacBook Pro 14-inch, M3 Pro chip, 18GB RAM, 512GB SSD, Space Black",
    packageImage: "",
    createdAt: formatDateTime(now - 3 * 24 * 60 * 60 * 1000),
    updatedAt: formatDateTime(now),
    progress,
  };
};

const TIMELINE_STEPS = [
  { label: "Created", description: "Shipment order received" },
  { label: "Picked Up", description: "Package collected from sender" },
  { label: "In Transit", description: "On the way to destination" },
  { label: "Arrived at Hub", description: "At local distribution center" },
  { label: "Out for Delivery", description: "With delivery driver" },
  { label: "Delivered", description: "Successfully delivered" },
];

// Position on the six-stage route. Every state carries its own step, so
// exception states park at the stage they occur at rather than at zero.
const getStatusIndex = (status) => getStatusState(status).step;

// States that mean the shipment is not progressing normally.
const ALERT_STATES = new Set([
  "on_hold",
  "action_required",
  "delayed",
  "returned",
  "failed",
  "lost",
  "seized",
  "cancelled",
]);

const isAlertStatus = (status) => ALERT_STATES.has(getStatusKey(status));

// Keyless Google Maps embed — good enough to place a city/address on a map.
const buildMapSrc = (location) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(
    location
  )}&z=9&output=embed`;

/**
 * Every shipping state the tracker can render, each with its own colour and
 * icon. `step` is where the state sits on the six-stage route (0-5) and decides
 * how far the progress bar fills; exception states carry the step they
 * typically occur at, so a held or seized parcel still shows the distance it
 * travelled instead of collapsing back to the start.
 *
 * Tailwind classes are written out in full — the JIT scanner cannot see class
 * names built by string concatenation.
 */
const SHIPMENT_STATES = {
  // ---- Normal progression ----
  created: {
    step: 0, icon: FileText,
    dot: "bg-slate-400", line: "bg-slate-400", text: "text-slate-600", bg: "bg-slate-50",
  },
  picked_up: {
    step: 1, icon: PackageCheck,
    dot: "bg-sky-500", line: "bg-sky-500", text: "text-sky-700", bg: "bg-sky-50",
  },
  in_transit: {
    step: 2, icon: Truck,
    dot: "bg-brand", line: "bg-brand", text: "text-brand", bg: "bg-brand-tint",
  },
  at_facility: {
    step: 3, icon: Warehouse,
    dot: "bg-indigo-500", line: "bg-indigo-500", text: "text-indigo-700", bg: "bg-indigo-50",
  },
  customs: {
    step: 3, icon: FileSearch,
    dot: "bg-teal-500", line: "bg-teal-500", text: "text-teal-700", bg: "bg-teal-50",
  },
  out_for_delivery: {
    step: 4, icon: Truck,
    dot: "bg-violet-500", line: "bg-violet-500", text: "text-violet-700", bg: "bg-violet-50",
  },
  delivered: {
    step: 5, icon: CircleCheck,
    dot: "bg-emerald-500", line: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50",
  },

  // ---- Exceptions ----
  on_hold: {
    step: 3, icon: PauseCircle,
    dot: "bg-amber-500", line: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50",
  },
  action_required: {
    step: 3, icon: CircleAlert,
    dot: "bg-yellow-500", line: "bg-yellow-500", text: "text-yellow-700", bg: "bg-yellow-50",
  },
  delayed: {
    step: 2, icon: Clock,
    dot: "bg-orange-600", line: "bg-orange-600", text: "text-orange-700", bg: "bg-orange-50",
  },
  returned: {
    step: 4, icon: Undo2,
    dot: "bg-fuchsia-600", line: "bg-fuchsia-600", text: "text-fuchsia-700", bg: "bg-fuchsia-50",
  },
  failed: {
    step: 4, icon: XCircle,
    dot: "bg-red-500", line: "bg-red-500", text: "text-red-600", bg: "bg-red-50",
  },
  lost: {
    step: 2, icon: PackageX,
    dot: "bg-rose-600", line: "bg-rose-600", text: "text-rose-700", bg: "bg-rose-50",
  },
  seized: {
    step: 3, icon: Ban,
    dot: "bg-red-700", line: "bg-red-700", text: "text-red-800", bg: "bg-red-50",
  },
  cancelled: {
    step: 0, icon: Ban,
    dot: "bg-zinc-500", line: "bg-zinc-500", text: "text-zinc-600", bg: "bg-zinc-100",
  },

  // ---- No usable status text ----
  // Deliberately parked at step 0 and rendered grey: an unknown status is not
  // evidence of progress, so it must not colour the bar or advance it.
  unknown: {
    step: 0, icon: CircleDot,
    dot: "bg-gray-400", line: "bg-gray-400", text: "text-muted", bg: "bg-gray-50",
  },

  // ---- Not yet reached ----
  pending: {
    step: 0, icon: Circle,
    dot: "bg-gray-300", line: "bg-gray-300", text: "text-muted", bg: "",
  },
};

// Text the API gives us when it has nothing; must not be read as a real status.
const NO_STATUS_TEXT = "Status not recorded";

/**
 * Display-only rewrites of status wording. Applied when the API response is
 * mapped, so the badge, banner, timeline row and colour matching all agree.
 * The stored record is untouched — this only changes what the page prints.
 */
const STATUS_ALIASES = [[/\b(shipment\s+)?on\s+hold\b/i, "Awaiting Clearance"]];

const applyStatusAlias = (status) =>
  STATUS_ALIASES.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    status || ""
  );

/**
 * Ordered keyword rules — first match wins, so the most specific and most
 * severe states are tested before the generic ones. "Seized by customs" has to
 * resolve to `seized`, not `customs`.
 */
const STATE_RULES = [
  // Checked first: a missing status must never fall through to a real state.
  ["unknown", ["status not recorded", "status unavailable", "unknown", "n/a"]],
  ["seized", ["seized", "confiscat", "impound", "detained"]],
  ["cancelled", ["cancel", "void", "aborted"]],
  ["returned", ["return", "rts", "sent back"]],
  ["lost", ["lost", "damaged", "missing", "destroyed"]],
  ["failed", ["failed", "unsuccessful", "undeliverable", "refused", "rejected", "not delivered"]],
  ["delivered", ["delivered", "signed for", "handed over"]],
  ["out_for_delivery", ["out for delivery", "with courier", "with driver"]],
  ["delayed", ["delay", "reschedul", "postponed", "late"]],
  ["on_hold", ["hold", "awaiting", "pending clearance", "suspended", "stopped"]],
  ["action_required", ["action", "review", "attention", "document", "information required"]],
  ["customs", ["customs", "clearance", "import", "export", "duty"]],
  ["at_facility", ["arrived", "facility", "hub", "warehouse", "sorting", "depot"]],
  ["in_transit", ["transit", "departed", "left", "en route", "on the way", "shipped"]],
  ["picked_up", ["picked", "collected", "received", "accepted", "dropped off"]],
  ["created", ["created", "label", "booked", "registered", "order placed"]],
];

const getStatusKey = (status) => {
  const s = (status || "").trim().toLowerCase();
  if (!s) return "unknown";
  const hit = STATE_RULES.find(([, keywords]) =>
    keywords.some((k) => s.includes(k))
  );
  return hit ? hit[0] : "in_transit";
};

const getStatusState = (status) =>
  SHIPMENT_STATES[getStatusKey(status)] || SHIPMENT_STATES.in_transit;

// Older call sites still ask for a colour key; the key is now the state name.
const getStatusColor = (status) => getStatusKey(status);
const STATUS_COLORS = SHIPMENT_STATES;

const getTransportIcon = (mode) => {
  const m = (mode || "").toLowerCase();
  if (m.includes("air")) return Plane;
  if (m.includes("sea")) return Ship;
  if (m.includes("rail")) return Train;
  return Truck;
};

const TrackingPageLoading = () => (
  <div className="min-h-screen bg-light">
    <div className="bg-ink py-10">
      <div className="container-wide">
        <div className="h-5 w-40 bg-white/10" />
        <div className="mt-2 h-4 w-56 bg-white/10" />
      </div>
    </div>
    <div className="container-wide py-10">
      <div className="animate-pulse space-y-5">
        <div className="h-48 bg-white border border-line" />
        <div className="h-64 bg-white border border-line" />
      </div>
    </div>
    <Footer />
  </div>
);

const TrackingPageContent = () => {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingResult, setTrackingResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  useEffect(() => {
    const numberParam = searchParams.get("number");
    if (numberParam) {
      setTrackingNumber(numberParam);
      handleTrackWithNumber(numberParam);
    }
  }, [searchParams]);

  const handleTrackWithNumber = async (number) => {
    if (!number.trim()) return;
    setIsLoading(true);
    setTrackingError(null);
    try {
      const packageData = await ApiService.getPackageByTracking(number);
      if (packageData) {
        const sender = packageData.sender || {};
        const receiver = packageData.receiver || {};
        const events = Array.isArray(packageData.events)
          ? packageData.events
          : [];

        setTrackingResult({
          trackingNumber: packageData.trackingNumber || number,
          status: applyStatusAlias(packageData.status) || NO_STATUS_TEXT,
          origin: sender.address || "Not available",
          destination: receiver.address || "Not available",
          transportMode:
            packageData.transportMode === "Ground"
              ? "By Road"
              : packageData.transportMode === "Air"
              ? "By Air"
              : packageData.transportMode === "Sea"
              ? "By Sea"
              : packageData.transportMode === "Rail"
              ? "By Rail"
              : "By Road",
          shipOutDate: formatDate(packageData.createdAt),
          expectedDelivery: formatDeliveryDate(packageData.expectedDelivery),
          currentLocation:
            events[events.length - 1]?.location ||
            sender.address ||
            "Not available",
          sender: {
            name: sender.name || "Not available",
            email: sender.email || "",
          },
          receiver: {
            name: receiver.name || "Not available",
            location: receiver.address || "Not available",
            email: receiver.email || "",
          },
          content: packageData.content || "",
          quantity: packageData.quantity || 1,
          description: packageData.description || "",
          // packageImage is stored as a base64 data URI in MongoDB.
          // packageImageUrl built by the backend is broken when the value is
          // already a data URI (it wraps it as http://host/uploads/<datauri>).
          // Detect which kind of value we have and use it correctly.
          packageImage: (() => {
            const raw = packageData.packageImage || "";
            if (raw.startsWith("data:") || raw.startsWith("http")) return raw;
            if (packageData.packageImageUrl) return packageData.packageImageUrl;
            return raw;
          })(),
          createdAt: formatDateTime(packageData.createdAt),
          updatedAt: formatDateTime(
            packageData.updatedAt || packageData.createdAt
          ),
          progress: events
            .map((event, index) => ({
              location: event.location || "Location not available",
              date: formatDate(event.timestamp),
              time: formatTime(event.timestamp),
              status: applyStatusAlias(event.status) || NO_STATUS_TEXT,
              current: index === events.length - 1,
            }))
            .reverse(),
        });
      } else {
        setTrackingError(
          `No shipment found for tracking number "${number}". Please check the number and try again.`
        );
        setTrackingResult(null);
      }
    } catch (error) {
      console.error("Error tracking package:", error);
      setTrackingError(
        "Unable to connect to tracking server. Please try again shortly."
      );
      setTrackingResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    handleTrackWithNumber(trackingNumber);
  };

  const statusIdx = trackingResult
    ? getStatusIndex(trackingResult.status)
    : -1;
  const alertStatus = trackingResult
    ? isAlertStatus(trackingResult.status)
    : false;
  const currentColor = trackingResult
    ? getStatusColor(trackingResult.status)
    : "in_transit";
  const TransportIcon = trackingResult
    ? getTransportIcon(trackingResult.transportMode)
    : Truck;

  return (
    <div className="min-h-screen bg-light">
      <main>
        {/* Dark search header */}
        <div className="bg-ink">
          <div className="container-wide py-8 sm:py-10">
            <Link
              href="/"
              className="mb-5 inline-flex items-center gap-1.5 text-[13px] text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.75} />
              Back to Home
            </Link>

            <div className="mb-1 flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={32}
                height={32}
                className="size-8 object-contain brightness-0 invert"
                priority
              />
              <span className="font-display text-lg text-white">
                <span className="font-extrabold">Apex</span>Courrier
              </span>
            </div>
            <p className="mb-6 text-[13px] text-white/40">
              Track your shipment in real-time
            </p>

            <form onSubmit={handleTrack} className="flex max-w-lg gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/25"
                  strokeWidth={1.75}
                />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border border-white/10 bg-white/[0.07] py-2.5 pl-10 pr-4 text-[14px] text-white placeholder:text-white/25 outline-none transition-colors focus:border-brand/50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-brand px-5 py-2.5 text-[13px] font-bold uppercase tracking-[1px] text-white transition-colors hover:bg-brand-dark disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="mx-auto size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Track"
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="container-wide py-8 sm:py-10">
          {/* Results */}
          {trackingResult && (
            <>
              <div className="grid gap-6 lg:grid-cols-3">
                {/* ---- LEFT COLUMN ---- */}
                <div className="flex flex-col gap-6 lg:col-span-2">
                  {/* Alert banner — sits under the progress timeline */}
                  {alertStatus && (
                    <div className="flex items-start gap-3 border-l-[3px] border-brand bg-brand-tint px-5 py-4">
                      <AlertTriangle
                        className="mt-0.5 size-4 shrink-0 text-brand"
                        strokeWidth={1.75}
                      />
                      <div>
                        <p className="text-[14px] font-bold text-brand">
                          {trackingResult.status}
                        </p>
                        <p className="mt-0.5 text-[13px] text-body">
                          This shipment requires attention before it can proceed.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Summary card */}
                  <div className="border border-line bg-white">
                    <div className="p-5 sm:p-6">
                      {/* Tracking number + status */}
                      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Tracking Number
                          </p>
                          <p className="mt-1 font-display text-lg font-bold tracking-wide text-ink">
                            {trackingResult.trackingNumber}
                          </p>
                        </div>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.5px] ${
                            alertStatus
                              ? "border border-brand/30 bg-brand-tint text-brand"
                              : statusIdx >= 5
                              ? "border border-green-300 bg-green-50 text-green-700"
                              : "border border-line bg-light text-ink"
                          }`}
                        >
                          {alertStatus && (
                            <AlertTriangle className="size-3" strokeWidth={2} />
                          )}
                          {statusIdx >= 5 && (
                            <CheckCircle2 className="size-3" strokeWidth={2} />
                          )}
                          {trackingResult.status}
                        </span>
                      </div>

                      {/* From / To */}
                      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-muted"
                            strokeWidth={1.75}
                          />
                          <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              From
                            </p>
                            <p className="mt-0.5 text-[14px] font-bold text-ink">
                              {trackingResult.origin}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5">
                          <MapPin
                            className="mt-0.5 size-4 shrink-0 text-brand"
                            strokeWidth={1.75}
                          />
                          <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              To
                            </p>
                            <p className="mt-0.5 text-[14px] font-bold text-ink">
                              {trackingResult.destination}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Current location */}
                      <div className="mb-5 border-l-[3px] border-brand bg-brand-tint px-4 py-3">
                        <p className="text-[11px] uppercase tracking-widest text-muted">
                          Current Location
                        </p>
                        <p className="mt-0.5 text-[14px] font-bold text-ink">
                          {trackingResult.currentLocation}
                        </p>
                      </div>

                      {/* Dates row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-line bg-light px-4 py-3">
                          <div className="mb-1 flex items-center gap-1.5">
                            <Calendar
                              className="size-3 text-muted"
                              strokeWidth={1.75}
                            />
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              Ship Out Date
                            </p>
                          </div>
                          <p className="text-[14px] font-bold text-ink">
                            {trackingResult.shipOutDate}
                          </p>
                        </div>
                        <div className="border border-line bg-light px-4 py-3">
                          <div className="mb-1 flex items-center gap-1.5">
                            <Calendar
                              className="size-3 text-brand"
                              strokeWidth={1.75}
                            />
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              Expected Delivery
                            </p>
                          </div>
                          <p className="text-[14px] font-bold text-ink">
                            {trackingResult.expectedDelivery}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipment progress — FedEx-style vertical timeline */}
                  <div className="order-first border border-line bg-white">
                    <div className="p-5 sm:p-6">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <h2 className="font-display text-lg font-bold text-ink">
                          Shipment Progress
                        </h2>
                        <span
                          className={`shrink-0 text-[11px] font-bold uppercase tracking-widest ${
                            STATUS_COLORS[currentColor]?.text || "text-muted"
                          }`}
                        >
                          {trackingResult.status}
                        </span>
                      </div>
                      <p className="mb-8 text-[12px] text-muted">
                        Tracking: {trackingResult.trackingNumber}
                      </p>

                      {(() => {
                        // Events come in newest-first; the timeline reads oldest at
                        // the top down to the current stage, like FedEx.
                        const events =
                          trackingResult.progress.length > 0
                            ? [...trackingResult.progress].reverse().map((item) => ({
                                title: item.status,
                                location: item.location,
                                date: item.date,
                                time: item.time,
                                color: getStatusColor(item.status),
                              }))
                            : TIMELINE_STEPS.map((step, i) => ({
                                title:
                                  i === statusIdx && alertStatus
                                    ? trackingResult.status
                                    : step.label,
                                location: i === statusIdx ? trackingResult.currentLocation : "",
                                date: i === statusIdx ? trackingResult.updatedAt : "",
                                time: "",
                                color:
                                  i === statusIdx
                                    ? currentColor
                                    : i < statusIdx
                                    ? getStatusColor(step.label)
                                    : "pending",
                              }));

                        // The closing row is always "Delivered", so a trailing
                        // delivered event would render the word twice. Fold it
                        // into that row instead of listing it separately.
                        const last = events[events.length - 1];
                        const deliveredEvent =
                          last && getStatusKey(last.title) === "delivered"
                            ? last
                            : null;
                        const midEvents = deliveredEvent
                          ? events.slice(0, -1)
                          : events;

                        // Fallback view stops at the reached stage; live events are
                        // all real, so the last one is the current stage.
                        const activeEventIdx =
                          trackingResult.progress.length > 0
                            ? midEvents.length - 1
                            : Math.max(statusIdx, 0);

                        const isDelivered = currentColor === "delivered";

                        // Fixed milestone rows for "In Transit" and
                        // "Out for Delivery". They sit between the live
                        // events and the closing Delivered row so the
                        // timeline always shows the full journey.
                        const inTransitReached =
                          statusIdx >= (SHIPMENT_STATES.in_transit?.step ?? 2);
                        const outForDeliveryReached =
                          statusIdx >= (SHIPMENT_STATES.out_for_delivery?.step ?? 4);

                        const hasInTransitEvent = midEvents.some(
                          (e) => getStatusKey(e.title) === "in_transit",
                        );
                        const hasOutForDeliveryEvent = midEvents.some(
                          (e) => getStatusKey(e.title) === "out_for_delivery",
                        );

                        const rows = [
                          {
                            kind: "endpoint",
                            title: "From",
                            location: trackingResult.origin,
                            subLabel: "Label Created",
                            date: trackingResult.shipOutDate,
                          },
                          ...midEvents.map((e) => ({ kind: "event", ...e })),
                          ...(!hasInTransitEvent
                            ? [
                                {
                                  kind: "milestone",
                                  title: "In Transit",
                                  color: inTransitReached
                                    ? "in_transit"
                                    : "pending",
                                },
                              ]
                            : []),
                          ...(!hasOutForDeliveryEvent
                            ? [
                                {
                                  kind: "milestone",
                                  title: "Out for Delivery",
                                  color: outForDeliveryReached
                                    ? "out_for_delivery"
                                    : "pending",
                                },
                              ]
                            : []),
                          {
                            kind: "endpoint",
                            title: "Delivered",
                            color: "delivered",
                            location:
                              (isDelivered && deliveredEvent?.location) ||
                              trackingResult.destination,
                            subLabel: isDelivered
                              ? "Delivered On"
                              : "Scheduled Delivery Date",
                            date:
                              (isDelivered && deliveredEvent?.date) ||
                              trackingResult.expectedDelivery,
                            time: isDelivered ? deliveredEvent?.time : "",
                          },
                        ];

                        // Row index of the current stage. For milestone
                        // states (in_transit / out_for_delivery) that have
                        // no matching event, the active marker lands on the
                        // milestone row itself.
                        let activeRow;
                        if (isDelivered) {
                          activeRow = rows.length - 1;
                        } else if (
                          !hasInTransitEvent &&
                          getStatusKey(trackingResult.status) === "in_transit"
                        ) {
                          activeRow = rows.findIndex(
                            (r) => r.kind === "milestone" && r.title === "In Transit",
                          );
                        } else if (
                          !hasOutForDeliveryEvent &&
                          getStatusKey(trackingResult.status) === "out_for_delivery"
                        ) {
                          activeRow = rows.findIndex(
                            (r) =>
                              r.kind === "milestone" &&
                              r.title === "Out for Delivery",
                          );
                        } else {
                          activeRow = activeEventIdx + 1;
                        }
                        const trackColor =
                          STATUS_COLORS[currentColor]?.line || "bg-brand";

                        return (
                          <div className="relative">
                            {rows.map((row, i) => {
                              const isActive = i === activeRow;
                              const isReached = i <= activeRow;
                              const isLast = i === rows.length - 1;
                              const colors =
                                STATUS_COLORS[row.color] || STATUS_COLORS[currentColor];
                              const StepIcon = colors.icon || ArrowRight;

                              return (
                                <div
                                  key={i}
                                  className={`relative pl-[60px] ${isLast ? "pb-6" : "pb-9"}`}
                                >
                                  {/* Track segment for this row. The unreached
                                      part carries a slow travelling highlight
                                      so it reads as pending, not dead. */}
                                  <div
                                    className={`absolute inset-y-0 left-4 w-4 overflow-hidden bg-gray-200 ${
                                      i === 0 ? "rounded-t-full" : ""
                                    } ${isLast ? "rounded-b-full" : ""}`}
                                  >
                                    {(!isReached || (isActive && !isLast)) && (
                                      <div
                                        className="absolute inset-x-0 top-0 h-1/3 animate-track-pulse bg-gradient-to-b from-transparent via-white/80 to-transparent motion-reduce:hidden"
                                        style={{ animationDelay: `${i * 0.25}s` }}
                                      />
                                    )}
                                  </div>
                                  {isReached && (
                                    // The current stage stops its fill at the
                                    // marker. Running it through the gap below
                                    // would read as progress toward the next
                                    // stage, which has not happened yet.
                                    <motion.div
                                      className={`absolute left-4 w-4 origin-top ${trackColor} ${
                                        isActive && !isLast
                                          ? "top-0 h-6"
                                          : "inset-y-0"
                                      } ${i === 0 ? "rounded-t-full" : ""} ${
                                        isLast ? "rounded-b-full" : ""
                                      }`}
                                      initial={{ scaleY: 0 }}
                                      animate={{ scaleY: 1 }}
                                      transition={{
                                        duration: 0.45,
                                        ease: "easeOut",
                                        delay: i * 0.13,
                                      }}
                                    />
                                  )}

                                  {/* Marker */}
                                  {isActive ? (
                                    <motion.div
                                      className={`absolute left-0 top-0 z-10 flex size-12 items-center justify-center rounded-full border-4 border-white ${colors.dot}`}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      transition={{
                                        type: "spring",
                                        stiffness: 320,
                                        damping: 18,
                                        delay: 0.15 + activeRow * 0.13,
                                      }}
                                    >
                                      <StepIcon
                                        className="size-6 text-white"
                                        strokeWidth={2.25}
                                      />
                                    </motion.div>
                                  ) : (
                                    <motion.div
                                      className={`absolute left-[21px] top-[7px] z-10 size-1.5 rounded-full ${
                                        isReached ? "bg-white" : "bg-gray-400"
                                      }`}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.2, delay: 0.1 + i * 0.13 }}
                                    />
                                  )}

                                  {/* Content */}
                                  <motion.div
                                    className={
                                      isActive
                                        ? `rounded-2xl px-4 py-3 ${colors.bg}`
                                        : ""
                                    }
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.35, delay: 0.1 + i * 0.13 }}
                                  >
                                    <p
                                      className={`text-[13px] font-bold uppercase tracking-wide ${
                                        isActive
                                          ? colors.text
                                          : isReached
                                          ? "text-ink"
                                          : "text-muted"
                                      }`}
                                    >
                                      {row.title}
                                    </p>
                                    {row.location && (
                                      <p
                                        className={`mt-0.5 text-[14px] ${
                                          row.kind === "endpoint"
                                            ? "font-bold text-ink"
                                            : isReached
                                            ? "text-ink"
                                            : "text-muted"
                                        }`}
                                      >
                                        {row.location}
                                      </p>
                                    )}
                                    {row.subLabel && (
                                      <p className="mt-1 text-[12px] italic text-muted">
                                        {row.subLabel}
                                      </p>
                                    )}
                                    {row.date && (
                                      <p className="text-[12px] text-muted">
                                        {row.date}
                                        {row.time ? ` ${row.time}` : ""}
                                      </p>
                                    )}

                                    {/* Live map of where the shipment is right now */}
                                    {isActive && row.location && (
                                      <motion.div
                                        className="mt-3 overflow-hidden rounded-xl border border-white/70"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        transition={{
                                          duration: 0.4,
                                          delay: 0.35 + activeRow * 0.13,
                                        }}
                                      >
                                        <iframe
                                          title={`Map of ${row.location}`}
                                          src={buildMapSrc(row.location)}
                                          className="block h-[180px] w-full border-0 sm:h-[220px]"
                                          loading="lazy"
                                          referrerPolicy="no-referrer-when-downgrade"
                                        />
                                        <div className="flex items-center gap-1.5 bg-white/70 px-3 py-2">
                                          <MapPin
                                            className={`size-3.5 ${colors.text}`}
                                            strokeWidth={2}
                                          />
                                          <span className="text-[12px] font-semibold text-ink">
                                            Current location
                                          </span>
                                        </div>
                                      </motion.div>
                                    )}
                                  </motion.div>
                                </div>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* ---- RIGHT SIDEBAR ---- */}
                <div className="space-y-6">
                  {/* Receiver */}
                  <div className="border border-line bg-white">
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <UserCheck
                          className="size-4 text-brand"
                          strokeWidth={1.75}
                        />
                        <h3 className="font-display text-[14px] font-bold text-ink">
                          Receiver Details
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Name
                          </p>
                          <p className="mt-0.5 text-[14px] font-bold text-ink">
                            {trackingResult.receiver.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Location
                          </p>
                          <p className="mt-0.5 text-[14px] font-bold text-ink">
                            {trackingResult.receiver.location}
                          </p>
                        </div>
                        {trackingResult.receiver.email && (
                          <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              Email
                            </p>
                            <a
                              href={`mailto:${trackingResult.receiver.email}`}
                              className="mt-0.5 text-[14px] text-brand hover:underline"
                            >
                              {trackingResult.receiver.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sender */}
                  <div className="border border-line bg-white">
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <User
                          className="size-4 text-brand"
                          strokeWidth={1.75}
                        />
                        <h3 className="font-display text-[14px] font-bold text-ink">
                          Sender Details
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Name
                          </p>
                          <p className="mt-0.5 text-[14px] font-bold text-ink">
                            {trackingResult.sender.name}
                          </p>
                        </div>
                        {trackingResult.sender.email && (
                          <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              Email
                            </p>
                            <a
                              href={`mailto:${trackingResult.sender.email}`}
                              className="mt-0.5 text-[14px] text-brand hover:underline"
                            >
                              {trackingResult.sender.email}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Package image */}
                  <div className="border border-line bg-white">
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Box
                          className="size-4 text-brand"
                          strokeWidth={1.75}
                        />
                        <h3 className="font-display text-[14px] font-bold text-ink">
                          Package Image
                        </h3>
                      </div>
                      <div className="relative overflow-hidden bg-light p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={trackingResult.packageImage || "/product.png"}
                          alt={trackingResult.content || "Package image"}
                          className="w-full object-contain max-h-[300px]"
                        />
                      </div>
                      <div className="mt-3 text-center">
                        <p className="text-[14px] font-bold text-ink">
                          {trackingResult.content}
                        </p>
                        {trackingResult.description && (
                          <p className="mt-1 text-[12px] text-muted leading-relaxed">
                            {trackingResult.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shipment details */}
                  <div className="border border-line bg-white">
                    <div className="p-5">
                      <div className="mb-4 flex items-center gap-2">
                        <Package
                          className="size-4 text-brand"
                          strokeWidth={1.75}
                        />
                        <h3 className="font-display text-[14px] font-bold text-ink">
                          Shipment Details
                        </h3>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Content
                          </p>
                          <p className="mt-0.5 text-[14px] font-bold uppercase text-ink">
                            {trackingResult.content}
                          </p>
                        </div>
                        {trackingResult.description && (
                          <div>
                            <p className="text-[11px] uppercase tracking-widest text-muted">
                              Description
                            </p>
                            <p className="mt-0.5 text-[14px] text-body">
                              {trackingResult.description}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Quantity
                          </p>
                          <p className="mt-0.5 text-[14px] font-bold text-ink">
                            {trackingResult.quantity}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Transport Mode
                          </p>
                          <div className="mt-0.5 flex items-center gap-1.5">
                            <TransportIcon
                              className="size-3.5 text-brand"
                              strokeWidth={1.75}
                            />
                            <p className="text-[14px] font-bold text-ink">
                              {trackingResult.transportMode}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 border-t border-line pt-3">
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Created
                          </p>
                          <p className="mt-0.5 text-[13px] text-body">
                            {trackingResult.createdAt}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] uppercase tracking-widest text-muted">
                            Last Updated
                          </p>
                          <p className="mt-0.5 text-[13px] text-body">
                            {trackingResult.updatedAt}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Need help */}
                  <div className="border border-line bg-white">
                    <div className="p-5">
                      <h3 className="font-display text-[14px] font-bold text-ink mb-2">
                        Need Help?
                      </h3>
                      <p className="text-[13px] text-muted leading-relaxed mb-4">
                        Have questions about your shipment? Contact our support
                        team.
                      </p>
                      <a
                        href="mailto:info@apexcourrier.com"
                        className="flex w-full items-center justify-center gap-2 border border-line py-[14px] text-[13px] font-bold uppercase tracking-[1px] text-ink transition-colors hover:border-brand hover:text-brand"
                      >
                        <Mail className="size-4" strokeWidth={1.75} />
                        Contact Support
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error / not-found state */}
          {!trackingResult && !isLoading && trackingError && (
            <div className="py-16 text-center">
              <AlertTriangle
                className="mx-auto mb-4 size-12 text-brand"
                strokeWidth={1}
              />
              <h2 className="font-display text-lg font-bold text-ink mb-1">
                Shipment not found
              </h2>
              <p className="text-[14px] text-muted max-w-sm mx-auto">
                {trackingError}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!trackingResult && !isLoading && !trackingError && (
            <div className="py-16 text-center">
              <Package
                className="mx-auto mb-4 size-12 text-line"
                strokeWidth={1}
              />
              <h2 className="font-display text-lg font-bold text-ink mb-1">
                Track your shipment
              </h2>
              <p className="text-[14px] text-muted">
                Enter a tracking number above to get started.
              </p>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 size-8 border-2 border-line border-t-brand rounded-full animate-spin" />
              <p className="text-[14px] text-muted">
                Looking up your shipment...
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

const TrackingPage = () => (
  <Suspense fallback={<TrackingPageLoading />}>
    <TrackingPageContent />
  </Suspense>
);

export default TrackingPage;