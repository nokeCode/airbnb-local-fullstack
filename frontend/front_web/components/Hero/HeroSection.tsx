import HeroText from './HeroText';
import HeroVisual from './HeroVisual';

export default function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center mt-12 lg:mt-24 gap-16 lg:gap-8">
      <div className="w-full lg:w-[55%]">
        <HeroText />
      </div>
      <div className="w-full lg:w-[45%] flex justify-center lg:justify-end lg:pr-12">
        <HeroVisual />
      </div>
    </div>
  );
}