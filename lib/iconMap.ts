import {
  Building2,
  Hammer,
  HardHat,
  Ruler,
  DraftingCompass,
  Home,
  House,
  Paintbrush,
  Palette,
  Sofa,
  Lamp,
  Sparkles,
  Lightbulb,
  Wifi,
  Cpu,
  Shield,
  Lock,
  Camera,
  Sun,
  Battery,
  Zap,
  Leaf,
  Wrench,
  Settings,
  Layers,
  Grid,
  ClipboardList,
  Briefcase,
  Users,
  BarChart,
} from "lucide-react";

//because we can't use < "Building2"/> 
// we need a map that maps the icon names 
//"Building2" → actual React component Building2

export const ICON_MAP = {
  Building2: Building2,
  Hammer: Hammer,
  HardHat: HardHat,
  Ruler: Ruler,
  DraftingCompass: DraftingCompass,
  Home: Home,
  House: House,
  Paintbrush: Paintbrush,
  Palette: Palette,
  Sofa: Sofa,
  Lamp: Lamp,
  Sparkles: Sparkles,
  Lightbulb: Lightbulb,
  Wifi: Wifi,
  Cpu: Cpu,
  Shield: Shield,
  Lock: Lock,
  Camera: Camera,
  Sun: Sun,
  Battery: Battery,
  Zap: Zap,
  Leaf: Leaf,
  Wrench: Wrench,
  Settings: Settings,
  Layers: Layers,
  Grid: Grid,
  ClipboardList: ClipboardList,
  Briefcase: Briefcase,
  Users: Users,
  BarChart: BarChart,
};

//it is like dictionary (key: string, value: react component -imported-)


//It creates a strict list of allowed strings
export type IconName = keyof typeof ICON_MAP;

// Optional: useful for admin UI
export const AVAILABLE_ICONS: IconName[] = Object.keys(
  ICON_MAP
) as IconName[];