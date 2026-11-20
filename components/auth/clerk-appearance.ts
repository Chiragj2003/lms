/** Makes Clerk's sign-in and sign-up forms match the site (ink buttons, soft fields, Outfit). */
export const clerkAppearance = {
    variables : {
        colorPrimary : "#121216",
        colorText : "#121216",
        colorTextSecondary : "#5E6070",
        colorInputBackground : "#F4F5F9",
        colorInputText : "#121216",
        borderRadius : "1rem",
        fontFamily : "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
    },
    elements : {
        rootBox : "w-full",
        cardBox : "w-full shadow-none border-0",
        card : "w-full shadow-none border-0 bg-transparent p-0",
        header : "hidden",
        footerAction : "hidden",
        formButtonPrimary : "rounded-full h-11 text-[15px] font-semibold normal-case",
        socialButtonsBlockButton : "rounded-full h-11",
        formFieldInput : "rounded-2xl h-11",
    },
};
