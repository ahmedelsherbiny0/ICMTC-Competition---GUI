/**
 * @file ConfigItem.tsx
 * @description A styled box representing a configuration item label, with a dynamic
 * color and click handler to toggle its enabled/disabled state.
 */


interface ConfigItemProps {
  /** The text to display inside the item box (e.g., "Thruster 1"). */
  label: string;
  /** A callback function that is fired when the item is clicked. */
  onClick: () => void;
  /** A boolean that determines the background color (active/inactive). */
  enabled: boolean;
}

export default function ConfigItem({ label, onClick, enabled }: ConfigItemProps) {
  // Determine the background color class based on the 'enabled' prop.
  const backgroundClass = enabled ? 'bg-active' : 'bg-component-background';

  return (
    <div
      onClick={onClick}
      // Combine the dynamic background class with other consistent styling.
      // The cursor-pointer class indicates that this is a clickable element.
      className={`${backgroundClass} h-full w-36 py-4 flex items-center justify-center text-center rounded-xl cursor-pointer transition-colors`}
    >
      {label}
    </div>
  );
}
