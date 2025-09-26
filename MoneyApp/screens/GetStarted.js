import React, { useState } from "react";
import image4 from "./image-4.png";

export const GetStarted = (): JSX.Element => {
    const [isSignUpHovered, setIsSignUpHovered] = useState(false);
    const [isLogInHovered, setIsLogInHovered] = useState(false);

    const handleSignUpClick = () => {
        // Handle sign up navigation
        console.log("Sign up clicked");
    };

    const handleLogInClick = () => {
        // Handle log in navigation
        console.log("Log in clicked");
    };

    return (
        <main className="bg-[linear-gradient(295deg,rgba(54,54,54,1)_7%,rgba(90,197,169,1)_100%)] w-full min-w-[390px] min-h-[844px] flex">
            <div className="mt-[194px] w-[344px] h-[499.6px] ml-[23px] flex-col items-center flex relative">
                <img
                    className="relative self-stretch w-full aspect-[1] object-cover"
                    alt="MyMoney app logo"
                    src={image4}
                />

                <nav
                    className="flex-col w-[300px] items-start gap-[13px] flex-[0_0_auto] flex relative"
                    role="navigation"
                    aria-label="Authentication options"
                >
                    <button
                        className="relative w-[300px] h-[71.3px] shadow-[0px_4px_8px_#00000040] transition-transform duration-200 hover:scale-105 focus:scale-105 active:scale-95"
                        onClick={handleSignUpClick}
                        onMouseEnter={() => setIsSignUpHovered(true)}
                        onMouseLeave={() => setIsSignUpHovered(false)}
                        aria-label="Sign up for a new account"
                    >
                        <div
                            className={`w-[300px] h-[71px] items-center justify-center gap-2.5 px-[103px] py-[13px] bg-white rounded-[28px] flex relative transition-colors duration-200 ${isSignUpHovered ? "bg-gray-50" : "bg-white"}`}
                        >
              <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                SIGN UP
              </span>
                        </div>
                    </button>

                    <button
                        className="relative w-[300px] h-[71.3px] shadow-[0px_4px_8px_#00000040] transition-transform duration-200 hover:scale-105 focus:scale-105 active:scale-95"
                        onClick={handleLogInClick}
                        onMouseEnter={() => setIsLogInHovered(true)}
                        onMouseLeave={() => setIsLogInHovered(false)}
                        aria-label="Log in to your existing account"
                    >
                        <div
                            className={`w-[300px] h-[71px] items-center justify-center gap-2.5 px-[101px] py-[13px] bg-white rounded-[28px] flex relative transition-colors duration-200 ${isLogInHovered ? "bg-gray-50" : "bg-white"}`}
                        >
              <span className="relative w-fit [font-family:'Inter-Regular',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                LOG IN
              </span>
                        </div>
                    </button>
                </nav>
            </div>
        </main>
    );
};
