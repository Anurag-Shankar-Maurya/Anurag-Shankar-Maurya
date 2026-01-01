import { IconType } from "react-icons";

import {
  HiArrowUpRight,
  HiOutlineLink,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiArrowRight,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineDocument,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineRocketLaunch,
  HiOutlineEllipsisHorizontalCircle,
} from "react-icons/hi2";

import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
} from "react-icons/pi";

// Additional icons from lucide-react (small, consistent icon set)
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  Mail,
  Globe as LucideGlobe,
  User as LucideUser,
  Grid as LucideGrid,
  BookOpen,
  Link as LucideLink,
  Calendar as LucideCalendar,
  Home as LucideHome,
  Image as LucideImage,
  Eye as LucideEye,
  EyeOff as LucideEyeOff,
  FileText,
  Rocket as LucideRocket,
  MoreHorizontal,
  Briefcase,
  GraduationCap,
  Award,
  Star,
  Zap,
  ChevronDown,
  Loader2,
  MapPin,
  ExternalLink,
  Download,
  Code,
  Terminal,
  Cpu,
  Menu,
  X as LucideX,
  Check,
  AlertCircle,
} from 'lucide-react';

// A few extra brand/utility icons from FontAwesome not already imported
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaPlay, FaImage, FaGlobe, FaJava, FaMicrosoft } from 'react-icons/fa6';

import {
  SiJavascript,
  SiNextdotjs,
  SiFigma,
  SiSupabase,
} from "react-icons/si";

import { FaDiscord, FaGithub, FaLinkedin, FaX, FaThreads, FaXTwitter, FaFacebook, FaPinterest, FaWhatsapp, FaReddit, FaTelegram, FaInstagram, FaYoutube, FaDribbble, FaBehance, FaMedium, FaDev, FaStackOverflow, } from "react-icons/fa6";

export const iconLibrary: Record<string, IconType> = {
  arrowUpRight: HiArrowUpRight,
  arrowRight: HiArrowRight,
  email: HiEnvelope,
  globe: HiOutlineGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  apps: PiGridFourDuotone, // alias for header MegaMenu toggle
  book: PiBookBookmarkDuotone,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  linkedin: FaLinkedin,
  x: FaX,
  twitter: FaXTwitter,
  threads: FaThreads,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  document: HiOutlineDocument,
  rocket: HiOutlineRocketLaunch,
  javascript: SiJavascript,
  nextjs: SiNextdotjs,
  supabase: SiSupabase,
  figma: SiFigma,
  facebook: FaFacebook,
  pinterest: FaPinterest,
  whatsapp: FaWhatsapp,
  reddit: FaReddit,
  telegram: FaTelegram,
  instagram: FaInstagram,
  youtube: FaYoutube,
  dribbble: FaDribbble,
  behance: FaBehance,
  medium: FaMedium,
  dev: FaDev,
  stackoverflow: FaStackOverflow,

  /* Added icons (non-destructive) */
  arrowLeft: ArrowLeft,
  mail: Mail,
  bookOpen: BookOpen,
  externalLink: ExternalLink,
  download: Download,
  loader: Loader2,
  more: MoreHorizontal,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  award: Award,
  star: Star,
  zap: Zap,
  chevronDown: ChevronDown,
  mapPin: MapPin,
  code: Code,
  terminal: Terminal,
  cpu: Cpu,
  menu: Menu,
  close: LucideX,
  check: Check,
  alert: AlertCircle,
  play: FaPlay,
  image: FaImage,

  /* Section-focused icons */
  projects: Briefcase,
  experience: Briefcase,
  education: GraduationCap,
  awards: Award,
  certificates: Award,
  skills: Zap,
  testimonials: Star,
  contact: Mail,

  /* Keep existing fallbacks */
  website: HiOutlineGlobeAsiaAustralia,
  other: HiOutlineEllipsisHorizontalCircle,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;
