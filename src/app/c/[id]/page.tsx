import { API_BASE } from "@/lib/api";
import type { Card } from "@/types";
import "./card.css";

async function fetchCard(id: string): Promise<Card | null> {
  const res = await fetch(`${API_BASE}/api/card.php?id=${id}`, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.item as Card;
}

export default async function CardView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const card = await fetchCard(id);
  const fullName = card?.title || "";
  const company = card?.company || "";
  const phone = card?.phone || "";
  const email = card?.email || "";
  const website = card?.website || "";
  const address = card?.address || "";
  const photoUrl = card?.photo_url || "";
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `ORG:${company}`,
    phone ? `TEL;TYPE=CELL:${phone}` : "",
    email ? `EMAIL:${email}` : "",
    website ? `URL:${website}` : "",
    address ? `ADR;TYPE=WORK:;;${address};;;;` : "",
    photoUrl ? `PHOTO;VALUE=URI:${photoUrl}` : "",
    "END:VCARD",
  ].filter(Boolean).join("\r\n");
  const fileName = (fullName || company || "contact").replace(/\s+/g, "_").toLowerCase() + ".vcf";
  const vcardDataUri = `data:text/vcard;charset=utf-8,${encodeURIComponent(vcf)}`;
  if (!card) {
    return (
      <main className="card-page">
        <div className="card">
          <div className="card-company">Carte introuvable</div>
        </div>
      </main>
    );
  }
  return (
    <main className="card-page">
        <div className="App animate-bottom">
        <div className="flex flex-col justify-center items-center">
            <div className="flex items-center justify-center relative w-full h-full -z-10 overflow-x-clip">
                <div className="qr-backdrop" id="color_palette" style={{ backgroundColor: "#3F3074", height: "421px" }}><svg
                        className="hidden md:block absolute" width="2080" height="379" viewBox="0 0 2080 379" fill="none"
                        xmlns="http://www.w3.org/2000/svg" style={{ width: "auto", height: "100%" }}>
                        <path d="M0 0H2080V340L0 360V0Z" fill="url(#paint0_linear_8_2)"></path>
                        <defs>
                            <linearGradient id="paint0_linear_8_2" x1="323.5" y1="0" x2="323.5" y2="364"
                                gradientUnits="userSpaceOnUse">
                                <stop stopColor="#4ACF92" className="duration-500"></stop>
                                <stop offset="1" stopColor="#3F3074" className="duration-500"></stop>
                            </linearGradient>
                        </defs>
                    </svg><svg className="md:hidden absolute" width="770" height="364" viewBox="0 0 770 364" fill="none"
                        xmlns="http://www.w3.org/2000/svg" style={{ width: "auto", height: "100%" }}>
                        <path d="M0 0H770V340L0 360V0Z" fill="url(#paint0_linear_8_4)"></path>
                        <defs>
                            <linearGradient id="paint0_linear_8_4" x1="323.5" y1="0" x2="323.5" y2="364"
                                gradientUnits="userSpaceOnUse">
                                <stop className="duration-500" stopColor="#4ACF92"></stop>
                                <stop offset="1" stopColor="#3F3074" className="duration-500"></stop>
                            </linearGradient>
                        </defs>
                    </svg></div>
            </div>
            <div
                className="flex flex-col items-center justify-center mt-[80px] w-full max-w-[700px] px-[16px] pb-[25px] zoom-block">
                <div
                    className="MuiAvatar-root MuiAvatar-circular border-[7px] rounded-full border-white shadow-[1px_6px_30px_rgba(0,31,14,0.05)] css-tq0t2d">
                    <img src={card.photo_url || undefined} alt={card.title}
                        className="MuiAvatar-img css-1hy9t21 rounded-full" />
                </div>
                <div className="mt-[32px] w-full word-break-fix" id="vcardName">
                    <h1 className="text-xl xs:text-2xl mb-[9px] font-bold duration-500 w-full word-break-fix"
                        style={{ fontFamily: "Montserrat", color: "rgb(255, 255, 255)" }}>{card.title}</h1>
                    <div className="text-balance w-full block">
                        <h2 className="text-base xs:text-lg duration-500 w-full word-break-fix"
                            style={{ fontFamily: "Montserrat", color: "rgb(255, 255, 255)" }}>{card.company}</h2>
                    </div>
                    <div className="mt-2"></div>
                </div>
                <div
                    className="flex flew-row space-x-[15px] rtl:space-x-0 rtl:gap-5 rtl:columns-3 xs:space-x-[10px] mt-[35px] xs:mt-[25px]">
                    <a href={`tel:${card.phone}`}
                        className="flex items-center justify-center w-[50px] xs:w-[62px] h-[50px] xs:h-[62px] bg-white rounded-full cursor-pointer hover:opacity-95 hover:scale-105 shadow-[1px_6px_30px_rgba(0,31,14,0.05)]"><span className="text-[#3F3074] text-xl">📞</span></a><a href={`mailto:${card.email}`}
                        className="flex items-center justify-center w-[50px] xs:w-[62px] h-[50px] xs:h-[62px] bg-white rounded-full cursor-pointer hover:opacity-95 hover:scale-105 shadow-[1px_6px_30px_rgba(0,31,14,0.05)]"><span className="text-[#3F3074] text-xl">✉️</span></a>
                </div>
                <div className="w-full">
                    <div className="py-[20px] px-[12px] xs:p-[20px] rounded-[4px] flex flex-col items-start justify-center w-full shadow-[1px_6px_30px_rgba(0,31,14,0.05)] mt-6"
                        style={{ fontFamily: "Roboto" }}>
                        <div className="w-full" id="vcardPhone">
                            <div className="w-full"><button
                                    className="flex flex-row space-x-[10px] xs:space-x-[16px] w-full cursor-pointer hover:opacity-80">
                                    <div className="bg-[#F9F9F9] p-[11px] rounded-full w-10 h-10"><span className="text-[#767C83] text-[18px]">📞</span></div>
                                    <div className="flex flex-col justify-center text-left w-full truncate rtl:text-right">
                                        <p className="text-[10px] xxs:text-xs text-[#767C83] rtl:mr-2 rtl:text-right">
                                            TELEPHONE</p>
                                        <p className="text-xs xxs:text-sm xs:text-base text-black font-medium truncate rtl:mr-2 rtl:text-right"
                                            style={{ fontFamily: "Roboto" }}>{card.phone}</p>
                                    </div>
                                </button>
                                <div className="w-full  my-[15px] bg-[#F2F2F2] rounded-full"></div>
                            </div>
                        </div>
                        <div className="w-full" id="vcardEmail">
                            <div className="w-full"><button
                                    className="flex flex-row space-x-[10px] xs:space-x-[16px] w-full cursor-pointer hover:opacity-80">
                                    <div className="bg-[#F9F9F9] p-[11px] rounded-full w-10 h-10"><span className="text-[#767C83] text-[18px]">✉️</span></div>
                                    <div
                                        className="flex flex-col justify-center text-left w-full truncate rtl:text-right rtl:mr-2">
                                        <p className="text-[10px] xxs:text-xs text-[#767C83] rtl:text-right rtl:mr-2">EMAIL
                                        </p>
                                        <p className="text-xs xxs:text-sm xs:text-base text-black font-medium truncate rtl:text-right rtl:mr-2"
                                            style={{ fontFamily: "Roboto" }}>{card.email}</p>
                                    </div>
                                </button>
                                <div className="w-full  my-[15px] bg-[#F2F2F2] rounded-full"></div>
                            </div>
                        </div>
                        <div className="w-full" id="vcardWeb">
                            <div className="w-full"><button
                                    className="flex flex-row space-x-[10px] xs:space-x-[16px] w-full cursor-pointer hover:opacity-80">
                                    <div className="bg-[#F9F9F9] p-[11px] rounded-full w-10 h-10"><span className="text-[#767C83] text-[18px]">🌐</span></div>
                                    <div className="flex flex-col justify-center text-left w-full truncate rtl:text-right">
                                        <p className="text-[10px] xxs:text-xs text-[#767C83] rtl:text-right rtl:mr-2">
                                            Website</p>
                                        <p className="text-xs xxs:text-sm xs:text-base text-black font-medium truncate rtl:text-right rtl:mr-2"
                                            style={{ fontFamily: "Roboto" }}>{card.website}</p>
                                    </div>
                                </button>
                                <div className="w-full  my-[15px] bg-[#F2F2F2] rounded-full"></div>
                            </div>
                        </div><button
                            className="flex flex-row space-x-[10px] xs:space-x-[16px] w-full cursor-pointer hover:opacity-80 items-center"
                            id="vcardCompany">
                            <div className="bg-[#F9F9F9] p-[11px] rounded-full w-10 h-10"><span className="text-[#767C83] text-[18px]">💼</span></div>
                            <div className="flex flex-col justify-center text-left text-balance w-full rtl:text-right">
                                <p
                                    className="text-[10px] xxs:text-xs text-[#767C83] w-full word-break-fix rtl:text-right rtl:mr-2">
                                    EVOSPORT</p>
                                <p className="text-xs xxs:text-sm xs:text-base text-black font-medium w-full word-break-fix rtl:text-right rtl:mr-2"
                                    style={{ fontFamily: "Roboto" }}>{card.company}</p>
                            </div>
                        </button>
                    </div><a
                        className="w-full flex flex-row justify-center items-center space-x-[10px] rounded-[4px] mt-[20px] py-[14px] cursor-pointer hover:opacity-80 duration-500"
                        id="vcardContact" style={{ backgroundColor: "rgb(63, 48, 116)" }} href={vcardDataUri} download={fileName}><span className="text-white text-[20px] rtl:ml-2">📇</span>
                        <p className="text-lg" style={{ fontFamily: "Roboto", color: "rgb(255, 255, 255)" }}>Ajouter aux contact</p>
                    </a>
                    {card.qr_url && (
                      <div className="mt-6 flex items-center gap-3">
                        <img src={card.qr_url as string} alt="QR code" className="w-24 h-24 border border-white/20 rounded-sm bg-black" />
                        <a href={card.qr_url as string} download={`qr_${id}.png`} className="px-3 py-2 border border-white/30 rounded-md text-sm text-white">Télécharger QR</a>
                      </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    </main>
  );
}
