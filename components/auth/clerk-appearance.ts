/**
 * Makes Clerk's sign-in and sign-up forms match the site: ink pill buttons,
 * soft borderless fields, Outfit, and no card or footer panel of its own.
 */
export const clerkAppearance = {
    variables : {
        colorPrimary : "#121216",
        colorText : "#121216",
        colorTextSecondary : "#5E6070",
        colorInputBackground : "#F4F5F9",
        colorInputText : "#121216",
        colorShadow : "transparent",
        borderRadius : "1rem",
        fontFamily : "var(--font-outfit), ui-sans-serif, system-ui, sans-serif",
        fontSize : "15px",
    },
    elements : {
        rootBox : "w-full",
        cardBox : "w-full shadow-none border-0 rounded-none",
        card : "w-full shadow-none border-0 bg-transparent p-0 gap-6",
        header : "hidden",
        footer : "bg-none bg-transparent shadow-none p-0 pt-2",
        footerAction : "hidden",
        socialButtonsBlockButton :
            "rounded-full h-11 border-0 bg-white text-ink shadow-[inset_0_0_0_1px_#E3E6EE] hover:bg-[#F4F5F9]",
        socialButtonsBlockButtonText : "text-[15px] font-medium",
        dividerLine : "bg-[#E3E6EE]",
        dividerText : "text-[#5E6070]",
        formFieldLabel : "text-sm font-medium text-ink",
        formFieldInput :
            "rounded-2xl h-11 border-0 bg-[#F4F5F9] shadow-none focus:shadow-[inset_0_0_0_2px_#121216] focus:ring-0",
        formButtonPrimary :
            "rounded-full h-11 bg-ink text-[15px] font-semibold normal-case shadow-none hover:bg-[#2E2F38] after:hidden",
        otpCodeFieldInput : "rounded-xl border-0 bg-[#F4F5F9] shadow-none",
        identityPreview : "rounded-2xl bg-[#F4F5F9] border-0",
        formResendCodeLink : "text-ink font-medium",
        footerActionLink : "text-ink font-semibold underline underline-offset-4",
    },
};
