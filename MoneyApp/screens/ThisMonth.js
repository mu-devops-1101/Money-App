import React from "react";
import { NavigationSection } from "./NavigationSection";
import { StatisticsSection } from "./StatisticsSection";
import chevronLeft from "./chevron-left.png";
import profileImage from "./profile-image.png";

export const ThisMonth = (): JSX.Element => {
    return (
        <div className="overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(222,249,242,0.8)_44%,rgba(90,197,169,1)_74%)] w-full min-w-[390px] min-h-[844px] relative">
            <StatisticsSection />
            <NavigationSection />
            <div className="absolute top-[-375px] left-[-272px] w-[761px] h-[484px] rounded-[380.62px/242.03px] rotate-[-178.90deg] shadow-[0px_4px_74.7px_4px_#00000030] bg-[linear-gradient(295deg,rgba(54,54,54,1)_7%,rgba(90,197,169,1)_100%)]" />

            <header className="inline-flex items-center gap-[18px] absolute top-7 left-[22px]">
                <button
                    className="relative w-[30px] h-[30px] cursor-pointer"
                    aria-label="Go back"
                >
                    <img className="w-full h-full" alt="Chevron left" src={chevronLeft} />
                </button>

                <h1 className="relative w-fit [font-family:'Inter-Bold',Helvetica] font-bold text-[#f2f2f2] text-2xl tracking-[0] leading-9 whitespace-nowrap">
                    Monthly Statistics
                </h1>

                <button
                    className="relative w-[66px] h-[66px] cursor-pointer"
                    aria-label="Profile menu"
                >
                    <img
                        className="w-full h-full rounded-full"
                        alt="Profile image"
                        src={profileImage}
                    />
                </button>
            </header>
        </div>
    );
};
