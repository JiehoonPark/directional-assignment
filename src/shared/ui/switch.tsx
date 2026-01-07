'use client';

import * as SwitchPrimitive from '@radix-ui/react-switch';

type SwitchProps = SwitchPrimitive.SwitchProps & {
  label?: string;
};

export function Switch({ label, ...props }: SwitchProps) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-600">
      {label ? <span>{label}</span> : null}
      <SwitchPrimitive.Root
        className="relative h-7 w-14 shrink-0 cursor-pointer rounded-md bg-slate-200 transition data-[state=checked]:bg-(--accent)  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--accent) shadow-inner"
        {...props}
      >
        <SwitchPrimitive.Thumb className="block h-6 w-6 translate-x-0.5 rounded-md bg-white shadow transition data-[state=checked]:translate-x-7" />
      </SwitchPrimitive.Root>
    </label>
  );
}
