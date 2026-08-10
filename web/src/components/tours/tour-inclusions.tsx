import { CheckCircle2, XCircle } from "lucide-react";

export function TourInclusions({
  includes,
  excludes,
}: {
  includes: string[];
  excludes: string[];
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white">
        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-5 py-3.5">
          <CheckCircle2 className="size-4 text-emerald-700" />
          <h3 className="font-semibold text-emerald-950">What&apos;s included</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {includes.map((item, index) => (
              <tr
                key={item}
                className={index % 2 === 1 ? "bg-emerald-50/40" : "bg-white"}
              >
                <td className="w-10 px-4 py-3 align-top">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </td>
                <td className="px-2 py-3 pr-4 text-navy/90">{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/80 bg-white">
        <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-5 py-3.5">
          <XCircle className="size-4 text-red-600" />
          <h3 className="font-semibold text-red-950">What&apos;s not included</h3>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {excludes.map((item, index) => (
              <tr
                key={item}
                className={index % 2 === 1 ? "bg-red-50/30" : "bg-white"}
              >
                <td className="w-10 px-4 py-3 align-top">
                  <XCircle className="size-4 text-red-500" />
                </td>
                <td className="px-2 py-3 pr-4 text-navy/90">{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
