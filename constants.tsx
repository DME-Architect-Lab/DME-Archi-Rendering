
import React from 'react';
import { 
  Building2, 
  Home, 
  Layers, 
  Grid3X3, 
  Map as MapIcon, 
  Sparkles, 
  Maximize, 
  RefreshCw, 
  Palette, 
  Layout, 
  Briefcase,
  Globe,
  PlusCircle,
  Eye,
  Armchair,
  Film
} from 'lucide-react';

export const NAVIGATION_TABS = [
  { id: 'Render', icon: <Building2 className="w-5 h-5" />, label: 'Render' },
  { id: 'Video', icon: <Film className="w-5 h-5" />, label: 'Image to Video' },
  { id: 'Improve', icon: <Sparkles className="w-5 h-5" />, label: 'Improve Render' },
  { id: 'Upscale', icon: <Maximize className="w-5 h-5" />, label: 'Upscale' },
  { id: 'Sync', icon: <RefreshCw className="w-5 h-5" />, label: 'Sync' },
  { id: 'Edit', icon: <Palette className="w-5 h-5" />, label: 'Edit' },
  { id: 'Canvas', icon: <Layout className="w-5 h-5" />, label: 'Canvas' },
  { id: 'Utilities', icon: <Briefcase className="w-5 h-5" />, label: 'Utilities' },
];

export const RENDER_MODES = [
  { id: 'Exterior', icon: <Building2 className="w-4 h-4" />, label: 'Exterior Render' },
  { id: 'Interior', icon: <Home className="w-4 h-4" />, label: 'Interior Render' },
  { id: 'Floorplan3D', icon: <Layers className="w-4 h-4" />, label: 'Floorplan to 3D' },
  { id: '3DFloorplan', icon: <Grid3X3 className="w-4 h-4" />, label: '3D Floorplan' },
  { id: 'Masterplan', icon: <MapIcon className="w-4 h-4" />, label: 'Masterplan to 3D' },
];

export const UTILITIES = [
  { 
    id: 'MapTo3D', 
    title: 'Google Map to 3D', 
    burmese: 'Google Map မှ 3D သို့', 
    desc: 'Transform map screenshots into realistic 3D landscapes.',
    icon: <Globe className="w-8 h-8 text-blue-400" /> 
  },
  { 
    id: 'InsertBuilding', 
    title: 'Insert Building', 
    burmese: 'အဆောက်အဦးထည့်သွင်းရန်', 
    desc: 'Place architectural models into real-world site photos.',
    icon: <PlusCircle className="w-8 h-8 text-green-400" /> 
  },
  { 
    id: 'VirtualTour', 
    title: 'Virtual Tour', 
    burmese: 'Virtual Tour ကြည့်ရန်', 
    desc: 'Generate immersive 360 views and camera transitions.',
    icon: <Eye className="w-8 h-8 text-purple-400" /> 
  },
  { 
    id: 'FurniturePlacement', 
    title: 'Furniture Placement', 
    burmese: 'ပရိဘောဂ နေရာချရန်', 
    desc: 'Automatically furnish empty rooms using moodboards.',
    icon: <Armchair className="w-8 h-8 text-amber-400" /> 
  },
  { 
    id: 'FillFloorplan', 
    title: 'Fill 2D Floorplan', 
    burmese: '2D ပုံစံ အရောင်ဖြည့်ရန်', 
    desc: 'Apply professional materials and colors to 2D drawings.',
    icon: <Palette className="w-8 h-8 text-indigo-400" /> 
  }
];

export const INTERIOR_RENDER_PRESETS = [
  { label: 'Real Estate Photography / အိမ်ခြံမြေ ဓာတ်ပုံ', value: 'High-end real estate photography, wide angle, bright and airy, crystal clear, 8k, architectural digest style' },
  { label: 'Cinematic Atmosphere / ရုပ်ရှင်ဆန်သော', value: 'Cinematic interior shot, dramatic lighting, depth of field, emotional atmosphere, movie set quality' },
  { label: '3D Visualization (V-Ray) / 3D ဒီဇိုင်း', value: 'Professional 3D rendering, V-Ray style, perfect material reflections, clean geometry, CGI' },
  { label: 'Cozy Home / နွေးထွေးသော အိမ်', value: 'Warm and cozy home atmosphere, lived-in feel, soft lighting, inviting composition' },
  { label: 'Luxury Editorial / ဇိမ်ခံ မဂ္ဂဇင်း', value: 'Luxury architectural magazine editorial, moody lighting, high contrast, expensive materials, detail oriented' }
];

export const STYLE_OPTIONS = [
  { label: 'Photorealistic / လက်တွေ့ဆန်သော', value: 'Hyper-realistic real estate photography, 8k resolution, highly detailed textures' },
  { label: 'V-Ray Render / 3D Render ပုံစံ', value: 'High-end V-Ray architectural render, global illumination, raytracing' },
  { label: 'Modern Minimalist / ခေတ်မီရိုးရှင်းသော', value: 'Modern minimalist architecture, clean lines, white and wood materials' },
  { label: 'Cinematic / ရုပ်ရှင်ဆန်သော', value: 'Cinematic architectural shot, dramatic lighting, movie scene look' },
  { label: 'Sketch / ခဲပန်းချီ', value: 'Architectural pencil sketch, hand-drawn style, white paper' }
];

export const CONTEXT_OPTIONS = [
  { label: 'High-end Urban / မြို့ပြအဆင့်မြင့်ရပ်ကွက်', value: 'in a high-end modern urban city area with clean streets, luxury shops, and manicured landscaping' },
  { label: 'Busy Street / လမ်းမကြီးဘေး', value: 'on a busy street with asphalt roads, street lights, sidewalks, and city traffic' },
  { label: 'Rural Landscape / ကျေးလက်ဒေသ', value: 'in a peaceful rural landscape with open fields, nature, and distant hills' },
  { label: 'Tropical Garden / အပူပိုင်းဥယျာဉ်', value: 'surrounded by lush tropical vegetation, palm trees, and vibrant garden plants' },
  { label: 'Riverside / မြစ်ကမ်းဘေး', value: 'situated next to a calm river with water reflections and a promenade' },
  { label: 'Beachfront / ကမ်းခြေ', value: 'on a sunny beachfront with ocean view and sandy terrain' },
  { label: 'Mountain / တောင်ပေါ်', value: 'in a mountainous area with misty background and rocky terrain' }
];

export const LIGHTING_OPTIONS = [
  { label: 'Natural Daylight / သဘာဝအလင်းရောင်', value: 'soft natural daylight entering through windows, balanced white balance, airy atmosphere' },
  { label: 'Warm Artificial / အခန်းတွင်းမီးရောင် (Warm)', value: 'warm artificial interior lighting, cozy atmosphere, tungsten light temperature (3000K)' },
  { label: 'Cold Modern / ခေတ်မီအလင်းရောင် (Cool)', value: 'cool modern lighting, bright white LED strips, clean and sterile atmosphere (6000K)' },
  { label: 'Golden Hour / နေဝင်ဆည်းဆာ', value: 'golden hour sunbeams hitting the interior, dramatic warm shadows, emotional lighting' },
  { label: 'Luxury Dark / ဇိမ်ခံအမှောင်', value: 'dimly lit luxury atmosphere, moody accent lighting, spot lights on features, high contrast' },
  { label: 'Overcast / တိမ်အုံ့ (ပျော့ပျောင်း)', value: 'soft diffused overcast light, no harsh shadows, even illumination' }
];

export const TONE_OPTIONS = [
  { label: 'Natural / သဘာဝ', value: 'natural true-to-life colors, balanced contrast, realistic photography' },
  { label: 'Cinematic / ရုပ်ရှင်ဆန်ဆန်', value: 'cinematic color grading, teal and orange hints, high contrast' },
  { label: 'Warm & Cozy / နွေးထွေးသော', value: 'warm color temperature, inviting atmosphere, soft yellow tones' },
  { label: 'Modern Cold / အေးမြသော', value: 'cool blue tones, crisp white balance, modern sterile look' },
  { label: 'Vintage / ရှေးဟောင်း', value: 'vintage film look, slight grain, retro color palette' },
  { label: 'Vibrant / တောက်ပသော', value: 'vibrant saturated colors, punchy contrast, architectural magazine style' }
];

export const ROOM_TYPES = [
  { label: 'Living Room / ဧည့်ခန်း', value: 'Living Room' },
  { label: 'Bedroom / အိပ်ခန်း', value: 'Master Bedroom' },
  { label: 'Kitchen / မီးဖိုချောင်', value: 'Modern Kitchen' },
  { label: 'Dining Room / ထမင်းစားခန်း', value: 'Dining Room' },
  { label: 'Bathroom / ရေချိုးခန်း', value: 'Luxury Bathroom' },
  { label: 'Home Office / ရုံးခန်း', value: 'Home Office' },
  { label: 'Coffee Shop / ကော်ဖီဆိုင်', value: 'Coffee Shop Interior' },
  { label: 'Retail Store / ဆိုင်ခန်း', value: 'Retail Store Interior' },
  { label: 'Hotel Lobby / ဟိုတယ်ဧည့်ခန်း', value: 'Hotel Lobby' },
  { label: 'Meeting Room / အစည်းအဝေးခန်း', value: 'Conference Room' }
];

export const ROOM_STYLES = [
  { label: 'Modern / ခေတ်မီ', value: 'Modern Contemporary interior design, sleek furniture, clean lines, neutral color palette with bold accents, open space' },
  { label: 'Neoclassical / နီယိုဂန္ထဝင်', value: 'Neoclassical interior design, elegant wall moldings, crystal chandeliers, velvet furniture, symmetry, gold and beige tones, luxury classic' },
  { label: 'Minimalist / ရိုးရှင်း (Minimalist)', value: 'Minimalist interior design, "less is more", white walls, natural light wood, functional uncluttered space, zen atmosphere' },
  { label: 'Luxury / ဇိမ်ခံ (Luxury)', value: 'Ultra-Luxury interior design, italian marble floors, expensive designer furniture, gold and brass metal accents, sophisticated lighting' },
  { label: 'Indochine / အင်ဒိုချိုင်းနား', value: 'Indochine interior style, tropical hardwoods, rattan furniture, french colonial influence, encaustic cement tiles, yellow and green tones' },
  { label: 'Scandinavian / စကင်ဒီနေးဗီးယန်း', value: 'Scandinavian interior design, hygge, light oak wood floors, white walls, soft textiles, pastel colors, bright and airy' },
  { label: 'Industrial / စက်မှုပုံစံ (Loft)', value: 'Industrial Loft interior design, exposed brick walls, concrete floors, ductwork, black metal window frames, leather furniture, raw' },
  { label: 'Wabi-Sabi / ဝါဘိဆာဘိ', value: 'Wabi-Sabi interior design, beauty in imperfection, rough raw plastered walls, natural stone, organic shapes, earthy muted tones' },
  { label: 'Japandi / ဂျပန်-စကင်ဒီ', value: 'Japandi interior design, blend of Japanese rustic minimalism and Scandinavian functionality, clean lines, bright spaces, natural materials' },
  { label: 'Bohemian / ဘိုဟီးမီးယန်း', value: 'Bohemian interior design, eclectic patterns, macrame, many plants, layered rugs, warm earth tones, relaxed atmosphere' },
  { label: 'Coastal / ကမ်းခြေ', value: 'Coastal interior design, beach house vibe, light blue and white palette, linen fabrics, natural light, breezy' },
  { label: 'Art Deco / အာ့ဒက်ကို', value: 'Art Deco interior design, geometric patterns, bold jewel tones, gold and chrome metals, velvet, glamourous' }
];

export const FLOORPLAN_VIEW_OPTIONS = [
  { label: 'Realistic Perspective / မျက်မြင်အမြင် (Perspective)', value: 'eye-level interior perspective view, standing inside the room' },
  { label: 'Isometric 3D / 3D အပေါ်စီးမြင်ကွင်း', value: 'isometric 3D floorplan view, cutaway walls, top-down angle' },
  { label: 'Top Down Plan / အပေါ်စီးဘလန် (Color)', value: '2D colored architectural plan, textured flooring, furniture symbols' }
];

export const TIME_OPTIONS = [
  'Bright Daylight / နေ့ခင်းဘက်',
  'Golden Hour / နေဝင်ဆည်းဆာ',
  'Blue Hour / မှောင်ရီပျိုးစ',
  'Overcast / တိမ်ဖုံးနေသော',
  'Night / ညဘက်'
];

export const ANGLE_OPTIONS = [
  'Perspective View / ဘေးစောင်း',
  'Frontal View / အရှေ့တည့်တည့်',
  'Bird\'s Eye View / အပေါ်စီး',
  'Ground Level / မြေပြင်အဆင့်',
  'Interior Close-up / အနီးကပ်'
];

export const FLOORPLAN_ANGLES = [
  'Top-down View / အပေါ်တည့်တည့်',
  'Perspective Axis / ဘေးစောင်း 3D',
  '3D Axonometric / အနားစောင်း 3D'
];

export const MAP_3D_TIMES = [
  'Day / နေ့လည်ခင်း',
  'Morning / မနက်ခင်း',
  'Evening / ညနေခင်း',
  'Night / ညဘက်'
];

export const MAP_3D_ANGLES = [
  'Bird\'s Eye View (45°) / အပေါ်စီး ၄၅ ဒီဂရီ',
  'Top Down (90°) / အပေါ်တည့်တည့်',
  'Drone High Angle / ဒရုန်း အမြင့်ရိုက်ချက်',
  'Cinematic Low Angle / အနိမ့်ရိုက်ချက်'
];

export const BACKGROUND_ENVIRONMENTS = [
  { id: 'city', label: 'Urban / မြို့ပြ', img: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop' },
  { id: 'forest', label: 'Nature / သဘာဝ', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop' },
  { id: 'garden', label: 'Garden / ဥယျာဉ်', img: 'https://images.unsplash.com/photo-1558905619-171547446a36?w=100&h=100&fit=crop' },
  { id: 'street', label: 'Streetside / လမ်းဘေး', img: 'https://images.unsplash.com/photo-1517733925043-473a38555279?w=100&h=100&fit=crop' }
];

export const ASPECT_RATIOS = ['1:1', '3:4', '4:3', '16:9', '9:16'];
