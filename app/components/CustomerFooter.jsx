const CustomerFooter = () => {
  return (
    <footer className="bg-surface-container-lowest py-16 border-t border-white/5">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-[300px]">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="size-6 text-primary-container">
              <img
                src="https://scontent.fcrk1-3.fna.fbcdn.net/v/t39.30808-6/644340223_122213082470530419_6615498980518078861_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=1d70fc&_nc_eui2=AeEgG4siFoRLWVvtPSEqyZ6C6XgpYHoEoUnpeClgegShSSNn7gW48rNushLosBNvbMtV9T4xvqZNtjSpRd91-iCk&_nc_ohc=rw7XoySkXqEQ7kNvwFojGGX&_nc_oc=AdoC_YfDtQU02H42WKNg7O8T3Qg2mxDYgGPQH7FvU0ARSLe-raddwJhKIg0A4BBXWps&_nc_zt=23&_nc_ht=scontent.fcrk1-3.fna&_nc_gid=Fs9oXNHCX0hKFD6MIjEyOQ&oh=00_Af0UWeeul3blDoNzL_aGqyzpaoZsvj2P9YLoPznYagzRlA&oe=69F0CEC0"
                alt="Ethan Marcus Diecast"
              />
            </div>
            <h2 className="font-headline text-lg font-bold uppercase tracking-tight">
              Ethan Marcus Diecast
            </h2>
          </div>
          <p className="text-sm font-light text-[#A8A8A0] leading-relaxed">
            The premier destination for elite diecast collectors. Machined
            precision, industrial curation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div>
            <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-white">
              Catalog
            </h5>
            <ul className="space-y-4 text-sm text-[#A8A8A0]">
              {["New Releases", "Vault Items", "Price Guide"].map((item) => (
                <li key={item}>
                  <a
                    className="hover:text-primary-container transition-colors"
                    href="#"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-black uppercase tracking-widest mb-6 text-white">
              Company
            </h5>
            <ul className="space-y-4 text-sm text-[#A8A8A0]">
              {["About", "Selling"].map((item) => (
                <li key={item}>
                  <a
                    className="hover:text-primary-container transition-colors"
                    href="#"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-[10px] font-bold uppercase tracking-widest text-[#555555] gap-4">
        <p>
          © 2026 Ethan Marcus Diecast. Authorized Partner of Premium Brands.
        </p>
        <div className="flex gap-6">
          <p>Developed by: Team Progidevs</p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
