import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

type ToggleGroupProps = ToggleGroupPrimitive.ToggleGroupSingleProps & {
  options: { label: string; value: string }[];
};

export function ToggleGroup({ options, ...props }: ToggleGroupProps) {
  return (
    <ToggleGroupPrimitive.Root
      {...props}
      className="inline-flex rounded-lg border border-subtle bg-white shadow-sm overflow-hidden"
    >
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className="px-3 py-2 text-sm text-slate-600 data-[state=on]:bg-(--accent) data-[state=on]:text-white hover:bg-slate-100 focus:outline-none"
        >
          {option.label}
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
}
