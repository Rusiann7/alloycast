const CustomerFooter = () => {
  return (
    <footer className="bg-background py-16 border-t border-secondary-container dark:border-white/30">
      <div className="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-[300px]">
          <div className="flex items-center gap-3 text-white mb-6">
            <div className="size-6 text-primary-container">
              <img src="/logo.jpg" alt="Ethan Marcus Diecast" />
            </div>
            <h2 className="font-headline text-xl text-font-color dark:text-foreground font-bold uppercase tracking-tight">
              Ethan Marcus Diecast
            </h2>
          </div>
          <p className="text-md font-light text-font-color/80 dark:text-foreground leading-relaxed">
            The premier destination for elite diecast collectors. Machined
            precision, industrial curation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 w-full md:w-auto">
          <div>
            <h5 className="text-sm font-black uppercase tracking-widest mb-6 text-font-color dark:text-foreground">
              Company
            </h5>
            <ul className="space-y-4 text-md text-">
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

      <div className="container mx-auto px-6 lg:px-12 mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between text-xs font-bold uppercase tracking-widest text-[#555555] gap-4">
        <p className="text-font-color dark:text-foreground">
          © 2026 Ethan Marcus Diecast. Authorized Partner of Premium Brands.
        </p>
        <div className="flex gap-6 text-secondary-container dark:text-foreground">
          <p>Developed by: Team Progidevs</p>
        </div>
      </div>
    </footer>
  );
};

export default CustomerFooter;
