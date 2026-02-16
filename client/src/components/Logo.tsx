import Image from "next/image";
import logo from "@/assets/LogoHighRes.png";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo = ({ width = 120, height = 40, className = "" }: LogoProps) => {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={logo}
        alt="UrbanKey Logo"
        width={width}
        height={height}
        // 'priority' ensures the logo loads early (Good for SEO/LCP)
        priority={true}
        // 'style' helps maintain aspect ratio if only one dimension is changed
        style={{ width: width === 0 ? "auto" : width, height: "auto" }}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;