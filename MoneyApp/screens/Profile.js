import React, { useState } from "react";
import { Link } from "react-router-dom";
import blue from "./blue.svg";
import chevronLeft from "./chevron-left.png";
import image from "./image.svg";
import line12 from "./line-1-2.svg";
import line13 from "./line-1-3.svg";
import line1 from "./line-1.svg";
import logOut1 from "./log-out-1.svg";
import profileImage from "./profile-image.png";
import purple from "./purple.svg";

export const Profile = (): JSX.Element => {
    const [profileData] = useState({
        username: "Wednesday_Addams",
        firstName: "Wednesday",
        lastName: "Addams",
        dateOfBirth: "20-12-1990",
        displayName: "Wednesday A.",
        status: "Online",
        isOnline: true,
    });

    const profileFields = [
        {
            label: "Username",
            value: profileData.username,
            lineImage: line1,
        },
        {
            label: "First Name",
            value: profileData.firstName,
            lineImage: image,
        },
        {
            label: "Last Name",
            value: profileData.lastName,
            lineImage: line12,
        },
        {
            label: "Date of Birth",
            value: profileData.dateOfBirth,
            lineImage: line13,
        },
    ];

    const handleLogout = () => {
        // Logout functionality would be implemented here
        console.log("Logging out...");
    };

    const handleBackNavigation = () => {
        // Back navigation functionality would be implemented here
        console.log("Navigating back...");
    };

    return (
        <main className="bg-[linear-gradient(180deg,rgba(255,255,255,1)_0%,rgba(222,249,242,0.8)_44%,rgba(90,197,169,1)_100%)] w-full min-w-[390px] min-h-[844px] relative">
            <img
                className="absolute top-0 left-[184px] w-[206px] h-[262px]"
                alt=""
                src={purple}
                role="presentation"
            />

            <img
                className="absolute top-0 left-[235px] w-[155px] h-[234px]"
                alt=""
                src={blue}
                role="presentation"
            />

            <header className="absolute top-[39px] left-6">
                <button
                    onClick={handleBackNavigation}
                    className="relative w-[30px] h-[30px] cursor-pointer"
                    aria-label="Go back"
                >
                    <img className="w-full h-full" alt="Back" src={chevronLeft} />
                </button>
            </header>

            <h1 className="absolute top-[90px] left-[30px] [font-family:'Inter-Bold',Helvetica] font-bold text-[#3a3a3a] text-[40px] tracking-[0] leading-[normal] whitespace-nowrap">
                Profile
            </h1>

            <section
                className="absolute top-[170px] left-[29px] w-[66px] h-[66px]"
                aria-label="Profile picture"
            >
                <Link to="/profile" aria-label="View profile picture">
                    <img
                        className="absolute top-0 left-0 w-[66px] h-[66px] block rounded-full"
                        alt="Profile picture of Wednesday Addams"
                        src={profileImage}
                    />
                </Link>

                {profileData.isOnline && (
                    <div
                        className="absolute top-[52px] left-[52px] w-[13px] h-[13px] bg-[#20c968] rounded-[6.4px] border-[1.28px] border-solid border-white"
                        aria-label="Online status indicator"
                    />
                )}
            </section>

            <section
                className="absolute w-[135px] top-[178px] left-[109px] h-[51px] flex"
                aria-label="User information"
            >
                <div className="w-[139px] flex-col gap-2 h-[51px] flex">
                    <h2 className="w-[135px] h-6 text-xl whitespace-nowrap [font-family:'Inter-Regular',Helvetica] font-normal text-black tracking-[0] leading-[normal]">
                        {profileData.displayName}
                    </h2>

                    <span
                        className="w-12 h-[19px] [font-family:'SF_Pro_Text-Light',Helvetica] font-light text-[#5ac5a9] text-base tracking-[0] leading-[normal] whitespace-nowrap"
                        aria-label={`Status: ${profileData.status}`}
                    >
            {profileData.status}
          </span>
                </div>
            </section>

            <section
                className="absolute top-[272px] left-[30px] w-[315px] h-[304px] flex flex-col gap-6"
                aria-label="Profile details"
            >
                {profileFields.map((field, index) => (
                    <div key={field.label} className="w-[315px] flex">
                        <div className="w-[319px] h-[58px] flex flex-col">
                            <label className="w-auto h-[17px] [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-[#3a3a3a] text-sm tracking-[0] leading-[normal]">
                                {field.label}
                            </label>

                            <div className="w-auto h-[17px] mt-4 [font-family:'Inter-Regular',Helvetica] font-normal text-black text-sm tracking-[0] leading-[normal]">
                                {field.value}
                            </div>

                            <img
                                className="w-[315px] h-px mt-[7px] object-cover"
                                alt=""
                                src={field.lineImage}
                                role="presentation"
                            />
                        </div>
                    </div>
                ))}
            </section>

            <section
                className="absolute top-[618px] left-[30px] w-[317px] h-[72px]"
                aria-label="Account actions"
            >
                <button
                    onClick={handleLogout}
                    className="absolute top-0 left-0 w-[315px] h-[72px] rounded-[28px] border border-solid border-[#9999a3] cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center"
                    aria-label="Log out of account"
                >
          <span className="absolute top-6 left-6 [font-family:'Inter-ExtraBold',Helvetica] font-extrabold text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
            Log out
          </span>

                    <img
                        className="absolute top-[25px] left-[270px] w-[21px] h-[22px]"
                        alt=""
                        src={logOut1}
                        role="presentation"
                    />
                </button>
            </section>
        </main>
    );
};
