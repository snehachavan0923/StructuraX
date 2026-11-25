import { Laptop, Moon, Sun } from "lucide-react";
import { Select } from "./form-controls";
import type { ThemePreference } from "../../types/theme";
import { useTheme } from "../../hooks/use-theme";

const options: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: "system", label: "System", Icon: Laptop },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme();
  const selected = options.find((option) => option.value === preference);
  const Icon = selected?.Icon ?? Laptop;

  return (
    <label className="theme-switcher">
      <Icon aria-hidden="true" size={16} />
      <span className="sr-only">Color theme</span>
      <Select
        aria-label="Color theme"
        value={preference}
        onChange={(event) =>
          setPreference(event.currentTarget.value as ThemePreference)
        }
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </label>
  );
}
