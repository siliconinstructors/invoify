"use client";

// Components
import { FormInput, Subheading } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

const PaymentInformation = () => {
    const { _t } = useTranslationContext();
    return (
        <section>
            <Subheading>{_t("form.steps.paymentInfo.heading")}:</Subheading>
            <div className="flex flex-wrap gap-10 mt-5">
                <FormInput
                    name="details.paymentInformation.paymentMethod"
                    label="Payment method"
                    placeholder="Payment method"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.accountCurrency"
                    label="Account currency"
                    placeholder="ex(USD)"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.bankName"
                    label={_t("form.steps.paymentInfo.bankName")}
                    placeholder={_t("form.steps.paymentInfo.bankName")}
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.accountName"
                    label={_t("form.steps.paymentInfo.accountName")}
                    placeholder={_t("form.steps.paymentInfo.accountName")}
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.accountNumber"
                    label={_t("form.steps.paymentInfo.accountNumber")}
                    placeholder={_t("form.steps.paymentInfo.accountNumber")}
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.achRoutingNumber"
                    label="ACH routing number"
                    placeholder="ACH routing number"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.fedwireRoutingNumber"
                    label="Fedwire routing number"
                    placeholder="Fedwire routing number"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.accountType"
                    label="Account type"
                    placeholder="Business checking account"
                    vertical
                />
                <FormInput
                    name="details.paymentInformation.beneficiaryAddress"
                    label="Beneficiary address"
                    placeholder="Beneficiary address"
                    vertical
                />
            </div>
        </section>
    );
};

export default PaymentInformation;
