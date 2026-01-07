type LineStyleGuideProps = {
  solidLabel: string;
  dashedLabel: string;
};

export function LineStyleGuide({ solidLabel, dashedLabel }: LineStyleGuideProps) {
  return (
    <div className="flex flex-wrap gap-4 text-[11px]">
      <span className="inline-flex items-center gap-2">
        <span className="h-0.5 w-6 rounded-full bg-slate-500" />
        실선: {solidLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="h-0.5 w-6 border-t-2 border-dashed border-slate-500" />
        점선: {dashedLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="w-3 h-3 border rounded-full border-slate-500" />
        원형: {solidLabel}
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="w-3 h-3 border border-slate-500" />
        사각형: {dashedLabel}
      </span>
    </div>
  );
}
