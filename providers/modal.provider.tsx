"use client";

import { useMounted } from '@/hooks/use-mounted';
import { CertificateModal } from '@/components/modals/certificate.modal';
import { ReviewModal } from '@/components/modals/review.modal';
import { PaymentModal } from '@/components/modals/payment.modal';

export const ModalProvider = () => {
    
    const isMounted = useMounted();

    if (!isMounted) {
        return null;
    }
    
    return (
        <>
            <CertificateModal />
            <ReviewModal />
            <PaymentModal />
        </>
    )
}
