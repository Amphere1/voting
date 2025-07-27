import { Button } from "./ui/button";

export default function Hero() {
  return (
    <section className="relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC5f23bnwjPNLpg067x9MwL9sydZEwsKGBZ54Sft-msFOkr7tFJNrcyrkWmXZbn5ulcTbMDIKPBcASVLNkKdeRc6J-r9rdIVk7RVBzjtIEvMPnWmgagOTP_kltbiFLF-5abkUo46YjYoLkmjrCihehvonNVzyRVNaN4CAwZMwLbLa7ZIt90RIDm65tKTXN-6KKl5S2f38Cst1_n4C2Cu9e_sSUPFy95-81rpALKc4fyQNeFPz4Ef9QvShA1rf8CW2lNLoUxryhVMLyz')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-6 py-32 md:py-48 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 animate-fade-in-down">
          Welcome to VoteWise
        </h1>
        <p className="text-lg text-gray-200 mb-8 animate-fade-in-up">
          Your trusted platform for transparent and secure elections...
        </p>
        <div className="flex justify-center gap-4 animate-fade-in-up">
          <Button>Get Started</Button>
        </div>
      </div>
    </section>
  );
}
