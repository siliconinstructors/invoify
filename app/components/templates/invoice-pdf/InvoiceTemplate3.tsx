import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Types
import { InvoiceType, ItemType } from "@/types";

const PAGE_ONE_ITEM_LIMIT = 7;
const PAGE_TWO_ITEM_LIMIT = 12;

const colors = {
    ink: "#0b2743",
    muted: "#8a9bb1",
    rule: "#cfd8e3",
    panel: "#eef2f6",
    header: "#eef2f6",
    brand: "#2f63b7",
};

const formatDate = (value: string) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const withOnly = (value?: string) => {
    if (!value) return "";
    return value.toLowerCase().endsWith(" only") ? value : `${value} Only`;
};

const getCustomValue = (
    customInputs: InvoiceType["sender"]["customInputs"],
    keys: string[]
) => {
    const normalizedKeys = keys.map((key) => key.toLowerCase());
    return customInputs?.find((input) =>
        normalizedKeys.includes(input.key.toLowerCase())
    )?.value;
};

const joinAddress = (parts: Array<string | undefined>) =>
    parts.filter((part) => part && part.trim().length > 0).join(", ");

const formatSenderAddressLines = (sender: InvoiceType["sender"]) => {
    const address = sender.address || "";
    const lowerAddress = address.toLowerCase();
    const localityParts = [sender.city, sender.state, sender.zipCode].filter(
        (part) => part && !lowerAddress.includes(part.toLowerCase())
    );

    if (localityParts.length === 0) return [address];

    const localityLine =
        localityParts.length > 1
            ? `${localityParts.slice(0, -1).join(", ")} ${localityParts.at(-1)}`
            : localityParts[0];

    return [address, localityLine];
};

const formatReceiverAddressLines = (receiver: InvoiceType["receiver"]) => {
    let address = receiver.address || "";
    let city = receiver.city || "";
    const state = receiver.state || "";
    const zip = receiver.zipCode || "";
    const country = receiver.country || "";

    const words = address.trim().split(/\s+/);
    if (words.length > 1) {
        const lastWord = words[words.length - 1];
        if (!/\d/.test(lastWord)) {
            address = words.slice(0, -1).join(" ");
            city = city ? `${lastWord}, ${city}` : lastWord;
        }
    }

    const lines = [];
    if (address) lines.push(address);
    if (city) lines.push(city);

    const stateZip = [state, zip].filter(Boolean).join(", ");
    if (stateZip) lines.push(stateZip);

    if (country) lines.push(country);

    return lines;
};

const LogoMark = ({
    logo,
    senderName,
}: {
    logo?: string;
    senderName: string;
}) => {
    if (logo) {
        return (
            <img
                src={logo}
                height={70}
                alt={`Logo of ${senderName}`}
                style={{ height: "70px", width: "auto", objectFit: "contain", objectPosition: "left" }}
            />
        );
    }

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg
                width="70"
                height="70"
                viewBox="0 0 201 201"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ flex: "0 0 auto", marginLeft: "-7px" }}
            >
                <path
                    d="M22 23H102V84C102 92.284 108.716 99 117 99H178V179H98V118C98 109.716 91.284 103 83 103H22V23Z"
                    fill={colors.brand}
                />
            </svg>
            <div
                style={{
                    color: colors.brand,
                    fontSize: 31,
                    lineHeight: "30px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    marginLeft: "-7px",
                    marginTop: "-1px"
                }}
            >
                <div>SILICON</div>
                <div>INSTRUCTORS</div>
            </div>
        </div>
    );
};

const FooterIcon = ({ type }: { type: "phone" | "email" | "website" }) => {
    const common = {
        width: 14,
        height: 14,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: colors.muted,
        strokeWidth: 1.8,
        strokeLinecap: "round" as const,
        strokeLinejoin: "round" as const,
        style: { flex: "0 0 auto" },
    };

    if (type === "phone") {
        return (
            <svg {...common}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.6a2 2 0 0 1-.45 2.11L8 9.71a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.6.62A2 2 0 0 1 22 16.92z" />
            </svg>
        );
    }

    if (type === "email") {
        return (
            <svg {...common}>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 7 9 6 9-6" />
            </svg>
        );
    }

    return (
        <svg {...common}>
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 0 20" />
            <path d="M12 2a15.3 15.3 0 0 0 0 20" />
        </svg>
    );
};

const FooterItem = ({
    icon,
    children,
}: {
    icon: "phone" | "email" | "website";
    children: React.ReactNode;
}) => (
    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <FooterIcon type={icon} />
        <span>{children}</span>
    </span>
);

const Footer = ({
    sender,
    page,
    totalPages,
}: {
    sender: InvoiceType["sender"];
    page: number;
    totalPages: number;
}) => (
    <footer
        style={{
            position: "absolute",
            left: 70,
            right: 70,
            bottom: 12,
            borderTop: `1px solid ${colors.rule}`,
            paddingTop: 11,
            color: colors.muted,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}
    >
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <FooterItem icon="phone">
                <a href={`tel:${sender.phone}`} style={{ color: "inherit", textDecoration: "none" }}>
                    {sender.phone}
                </a>
            </FooterItem>
            <FooterItem icon="email">{sender.email}</FooterItem>
            <FooterItem icon="website">
                {getCustomValue(sender.customInputs, ["website", "url"]) ||
                    "https://siliconinstructors.com"}
            </FooterItem>
        </div>
        <span>
            Page {page}/{totalPages}
        </span>
    </footer>
);

const ItemsTable = ({
    items,
    startIndex,
    currency,
    showTableHeader = true,
}: {
    items: ItemType[];
    startIndex: number;
    currency: string;
    showTableHeader?: boolean;
}) => (
    <table
        style={{
            width: "100%",
            borderCollapse: "separate",
            borderSpacing: 0,
            color: colors.ink,
            fontSize: 12,
        }}
    >
        {showTableHeader && (
            <thead>
                <tr style={{ background: colors.header }}>
                    {[
                        "#",
                        "Items",
                        "SAC/HSN",
                        "Qty",
                        `Rate(${currency})`,
                        `Amount(${currency})`,
                    ].map((heading, index) => (
                        <th
                            key={heading}
                            style={{
                                padding: "12px 10px",
                                textAlign:
                                    index === 1
                                        ? "left"
                                        : index > 3
                                            ? "right"
                                            : "center",
                                fontWeight: 800,
                                borderTopLeftRadius: index === 0 ? 6 : 0,
                                borderTopRightRadius: index === 5 ? 6 : 0,
                            }}
                        >
                            {heading}
                        </th>
                    ))}
                </tr>
            </thead>
        )}
        <tbody>
            {items.map((item, index) => (
                <tr key={`${item.name}-${index}`}>
                    <td style={cellStyle("center")}>{startIndex + index + 1}.</td>
                    <td style={cellStyle("left")}>
                        <div style={{ fontWeight: 800, lineHeight: "20px", maxWidth: 160, wordBreak: "break-word" }}>
                            {item.name}
                        </div>
                        {item.description && (
                            <div
                                style={{
                                    color: colors.muted,
                                    marginTop: 9,
                                    lineHeight: "17px",
                                    whiteSpace: "pre-line",
                                }}
                            >
                                {item.description}
                            </div>
                        )}
                    </td>
                    <td style={cellStyle("center")}>{item.sacHsn || "998"}</td>
                    <td style={cellStyle("center")}>{item.quantity}</td>
                    <td style={cellStyle("right")}>
                        {formatNumberWithCommas(Number(item.unitPrice))}
                    </td>
                    <td style={cellStyle("right")}>
                        {formatNumberWithCommas(Number(item.total))}
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
);

const cellStyle = (textAlign: "left" | "center" | "right") => ({
    padding: "12px 10px",
    borderBottom: `1px solid ${colors.rule}`,
    verticalAlign: "top" as const,
    textAlign,
});

const BankDetails = ({ details }: { details: InvoiceType["details"] }) => {
    const bank = details.paymentInformation;

    return (
        <div style={{ color: colors.ink }}>
            <p style={{ color: colors.muted, fontSize: 12, margin: "0 0 6px" }}>
                Pay via bank transfer&nbsp; (Note: This account only accepts {details.currency || "USD"} payments)
            </p>
            <p style={{ color: colors.muted, fontSize: 12, margin: "0 0 5px" }}>
                Bank details:
            </p>
            <div
                style={{
                    width: 456,
                    minHeight: 150,
                    borderRadius: 7,
                    background: colors.panel,
                    padding: "16px 18px",
                    display: "flex",
                    gap: 14,
                    fontSize: 12,
                    lineHeight: "17px",
                }}
            >
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 999,
                        background: "#fff",
                        // color: "#00488d",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 7,
                        fontWeight: 800,
                        flex: "0 0 auto",
                    }}
                >
                    <img style={{ maxWidth: "50%" }} src="/assets/img/federalbank_logo.png" />
                </div>
                <div>
                    <BankLine label="Payment method" value={bank?.paymentMethod} />
                    <BankLine label="Account currency" value={bank?.accountCurrency} />
                    <BankLine label="Account number" value={bank?.accountNumber} />
                    <BankLine label="IFSC COde" value={bank?.ifscCode} />
                    <BankLine label="Account type" value={bank?.accountType} />
                    <BankLine label="Bank name" value={bank?.bankName} />
                    <BankLine
                        label="Beneficiary address"
                        value={bank?.beneficiaryAddress}
                    />
                    <BankLine label="Account holder name" value={bank?.accountName} />
                </div>
            </div>
        </div>
    );
};

const BankLine = ({ label, value }: { label: string; value?: string }) =>
    value ? (
        <div>
            <strong>{label}:</strong> {value}
        </div>
    ) : null;

const Signature = ({
    sender,
    details,
}: {
    sender: InvoiceType["sender"];
    details: InvoiceType["details"];
}) => (
    <div
        style={{
            width: 170,
            textAlign: "center",
            alignSelf: "flex-end",
            color: colors.ink,
        }}
    >
        {details.signature?.data && isDataUrl(details.signature.data) ? (
            <img
                src={details.signature.data}
                width={130}
                height={74}
                alt={`Signature of ${sender.name}`}
                style={{ objectFit: "contain", margin: "0 auto" }}
            />
        ) : details.signature?.data ? (
            <div
                style={{
                    fontSize: 28,
                    fontFamily: `${details.signature.fontFamily}, cursive`,
                    lineHeight: "58px",
                }}
            >
                {details.signature.data}
            </div>
        ) : (
            <div style={{ height: 74, paddingTop: 14, fontSize: 11 }}>
                <strong>For Silicon Instructors</strong>
                <div
                    style={{
                        width: 92,
                        borderTop: `2px solid ${colors.brand}`,
                        margin: "18px auto 0",
                    }}
                />
            </div>
        )}
        <p style={{ margin: "8px 0 0", fontSize: 12 }}>Authorized signature</p>
    </div>
);

const TotalsRow = ({
    label,
    value,
    bold,
}: {
    label: string;
    value: string;
    bold?: boolean;
}) => (
    <div
        style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: colors.ink,
            padding: "4px 0",
            fontWeight: bold ? 700 : 400,
        }}
    >
        <span>{label}</span>
        <span>{value}</span>
    </div>
);

const TotalsSection = ({ data }: { data: InvoiceType }) => {
    const { details } = data;

    const taxLabel = (() => {
        if (!details.taxDetails) return "Tax";
        const { amount, amountType } = details.taxDetails;
        return amountType === "percentage" ? `Tax (${amount}%)` : "Tax";
    })();

    return (
        <div style={{ marginTop: 18 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                }}
            >
                <div style={{ width: 330 }}>
                    <p
                        style={{
                            color: colors.muted,
                            fontSize: 12,
                            margin: "0 0 7px",
                        }}
                    >
                        Total in words
                    </p>
                    <p
                        style={{
                            margin: 0,
                            color: "#000",
                            fontSize: 15,
                            lineHeight: "18px",
                        }}
                    >
                        {withOnly(details.totalAmountInWords)}
                    </p>
                </div>

                <div style={{ width: 266 }}>
                    <TotalsRow
                        label="Sub Total"
                        value={formatNumberWithCommas(Number(details.subTotal))}
                    />
                    {details.discountDetails?.amount != undefined &&
                        details.discountDetails.amount > 0 && (
                            <TotalsRow
                                label="Discount"
                                value={`- ${formatNumberWithCommas(
                                    details.discountDetails.amountType === "percentage"
                                        ? (Number(details.subTotal) * Number(details.discountDetails.amount)) / 100
                                        : Number(details.discountDetails.amount)
                                )}`}
                            />
                        )}
                    {details.taxDetails?.amount != undefined &&
                        details.taxDetails.amount > 0 && (
                            <TotalsRow
                                label={taxLabel}
                                value={formatNumberWithCommas(
                                    details.taxDetails.amountType === "percentage"
                                        ? (Number(details.subTotal) * Number(details.taxDetails.amount)) / 100
                                        : Number(details.taxDetails.amount)
                                )}
                            />
                        )}
                    {details.shippingDetails?.cost != undefined &&
                        details.shippingDetails.cost > 0 && (
                            <TotalsRow
                                label="Shipping"
                                value={formatNumberWithCommas(
                                    details.shippingDetails.costType === "percentage"
                                        ? (Number(details.subTotal) * Number(details.shippingDetails.cost)) / 100
                                        : Number(details.shippingDetails.cost)
                                )}
                            />
                        )}
                    <TotalsRow
                        label="Total"
                        value={`${details.currency} ${formatNumberWithCommas(Number(details.totalAmount))}`}
                        bold
                    />
                    <div
                        style={{
                            width: 266,
                            height: 32,
                            borderRadius: 6,
                            background: colors.ink,
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0 15px 0 88px",
                            fontSize: 15,
                            fontWeight: 700,
                            marginTop: 6,
                        }}
                    >
                        <span>Total</span>
                        <span>
                            {details.currency}{" "}
                            {formatNumberWithCommas(Number(details.totalAmount))}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Page = ({
    data,
    items,
    startIndex,
    page,
    totalPages,
    showHeader,
    showTotals,
    showPayment,
}: {
    data: InvoiceType;
    items: ItemType[];
    startIndex: number;
    page: number;
    totalPages: number;
    showHeader: boolean;
    showTotals: boolean;
    showPayment: boolean;
}) => {
    const { sender, receiver, details } = data;
    const sellerName = sender.name || "SILICON INSTRUCTORS";
    const gstin =
        sender.gstin || getCustomValue(sender.customInputs, ["gstin", "gst"]);
    const pan = sender.pan || getCustomValue(sender.customInputs, ["pan"]);
    const senderAddressLines = formatSenderAddressLines(sender);
    const receiverAddressLines = formatReceiverAddressLines(receiver);

    return (
        <div className="silicon-page">
            <main
                style={{
                    padding: showHeader ? "52px 70px 74px" : "16px 70px 74px",
                }}
            >
                {showHeader && (
                    <>
                        <section
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                gap: 30,
                            }}
                        >
                            <div>
                                <LogoMark
                                    logo={details.invoiceLogo}
                                    senderName={sellerName}
                                />
                                <div
                                    style={{
                                        marginTop: 5,
                                        color: colors.ink,
                                        fontSize: 13,
                                        lineHeight: "19px",
                                        maxWidth: 350,
                                    }}
                                >
                                    <strong style={{ display: "block", textTransform: "uppercase" }}>
                                        {sellerName}
                                    </strong>
                                    <div>
                                        {[sender.address, sender.city, sender.state, sender.zipCode]
                                            .filter((part) => part && part.trim().length > 0)
                                            .join(", ")}
                                    </div>
                                    {gstin && <div>GSTIN: {gstin}</div>}
                                    {pan && <div>PAN: {pan}</div>}
                                </div>
                            </div>

                            <div
                                style={{
                                    textAlign: "right",
                                    color: colors.ink,
                                    paddingTop: 0,
                                    fontSize: 13,
                                    lineHeight: "20px",
                                }}
                            >
                                <h1
                                    style={{
                                        color: "#000",
                                        fontSize: 31,
                                        lineHeight: "36px",
                                        margin: "0 0 9px",
                                        fontWeight: 700,
                                    }}
                                >
                                    TAX INVOICE
                                </h1>
                                <div>
                                    <strong>Invoice #:</strong>{" "}
                                    <span style={{ color: colors.ink }}>
                                        {details.invoiceNumber || "Draft invoice"}
                                    </span>
                                </div>
                                <div>
                                    <strong>Invoice Date:</strong>{" "}
                                    {formatDate(details.invoiceDate)}
                                </div>
                                <div>
                                    <strong>Due Date:</strong>{" "}
                                    {formatDate(details.dueDate)}
                                </div>
                                <div>
                                    <strong>Payment terms:</strong>{" "}
                                    {details.paymentTerms}
                                </div>
                            </div>
                        </section>

                        <div
                            style={{
                                borderTop: `1px solid ${colors.rule}`,
                                marginTop: 20,
                                paddingTop: 20,
                            }}
                        >
                            <p
                                style={{
                                    color: colors.muted,
                                    margin: "0 0 8px",
                                    fontSize: 13,
                                }}
                            >
                                Bill to:
                            </p>
                            <div
                                style={{
                                    color: colors.ink,
                                    fontSize: 13,
                                    lineHeight: "18px",
                                    maxWidth: 200,
                                }}
                            >
                                <strong>{receiver.name}</strong>
                                <div style={{ marginTop: 5 }}>
                                    {receiverAddressLines.map((line) => (
                                        <div key={line}>{line}</div>
                                    ))}
                                </div>
                                {details.placeOfSupply && (
                                    <div style={{ marginTop: 2 }}>
                                        Place of supply : {details.placeOfSupply}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

                <section style={{ marginTop: showHeader ? 26 : 8 }}>
                    {items.length > 0 && (
                        <ItemsTable
                            items={items}
                            startIndex={startIndex}
                            currency={details.currency}
                            showTableHeader={showHeader}
                        />
                    )}
                </section>

                {showTotals && <TotalsSection data={data} />}

                {showPayment && (
                    <section
                        style={{
                            position: "absolute",
                            left: 70,
                            right: 70,
                            bottom: 66,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <BankDetails details={details} />
                        <Signature sender={sender} details={details} />
                    </section>
                )}
            </main>
            <Footer sender={sender} page={page} totalPages={totalPages} />
        </div>
    );
};

const InvoiceTemplate3 = (data: InvoiceType) => {
    const itemsCount = data.details.items.length;
    let pages = [];

    if (itemsCount <= 2) {
        pages = [
            {
                items: data.details.items,
                startIndex: 0,
                showHeader: true,
                showTotals: true,
                showPayment: true,
            },
        ];
    } else if (itemsCount <= 6) {
        pages = [
            {
                items: data.details.items,
                startIndex: 0,
                showHeader: true,
                showTotals: true,
                showPayment: false,
            },
            {
                items: [],
                startIndex: itemsCount,
                showHeader: false,
                showTotals: false,
                showPayment: true,
            },
        ];
    } else {
        pages.push({
            items: data.details.items.slice(0, 7),
            startIndex: 0,
            showHeader: true,
            showTotals: false,
            showPayment: false,
        });

        let currentIndex = 7;
        while (currentIndex < itemsCount) {
            const remainingItemsCount = itemsCount - currentIndex;

            if (remainingItemsCount <= 7) {
                pages.push({
                    items: data.details.items.slice(currentIndex),
                    startIndex: currentIndex,
                    showHeader: false,
                    showTotals: true,
                    showPayment: true,
                });
                currentIndex = itemsCount;
            } else if (remainingItemsCount <= 11) {
                pages.push({
                    items: data.details.items.slice(currentIndex),
                    startIndex: currentIndex,
                    showHeader: false,
                    showTotals: true,
                    showPayment: false,
                });
                pages.push({
                    items: [],
                    startIndex: itemsCount,
                    showHeader: false,
                    showTotals: false,
                    showPayment: true,
                });
                currentIndex = itemsCount;
            } else {
                const nextIndex = currentIndex + 12;
                pages.push({
                    items: data.details.items.slice(currentIndex, nextIndex),
                    startIndex: currentIndex,
                    showHeader: false,
                    showTotals: false,
                    showPayment: false,
                });
                currentIndex = nextIndex;
            }
        }

        const lastPage = pages[pages.length - 1];
        if (lastPage && !lastPage.showPayment) {
            if (!lastPage.showTotals) {
                pages.push({
                    items: [],
                    startIndex: itemsCount,
                    showHeader: false,
                    showTotals: true,
                    showPayment: true,
                });
            } else {
                pages.push({
                    items: [],
                    startIndex: itemsCount,
                    showHeader: false,
                    showTotals: false,
                    showPayment: true,
                });
            }
        }
    }

    return (
        <InvoiceLayout data={data}>
            <style>{`
                @page { size: A4; margin: 0; }
                html, body { margin: 0; padding: 0; background: #fff; }
                .silicon-page {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    width: 794px;
                    height: 1123px;
                    position: relative;
                    background: #fff;
                    overflow: hidden;
                    page-break-after: always;
                    box-sizing: border-box;
                }
                .silicon-page:last-child { page-break-after: auto; }
            `}</style>
            <div style={{ margin: "-40px" }}>
                {pages.map((page, index) => (
                    <Page
                        key={index}
                        data={data}
                        items={page.items}
                        startIndex={page.startIndex}
                        page={index + 1}
                        totalPages={pages.length}
                        showHeader={page.showHeader}
                        showTotals={page.showTotals}
                        showPayment={page.showPayment}
                    />
                ))}
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate3;
