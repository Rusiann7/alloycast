import LandingPageNavbar from "../components/LandingPageNavbar";
export const metadata = {
  title: "AlloyDash",
  description: "The premier destination for elite diecast collectors.",
};

export default function CustomerLayout({ children }) {
  return (
    <>
      <LandingPageNavbar />
      {children}
    </>
  );
}
