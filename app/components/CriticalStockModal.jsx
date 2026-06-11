import Image from "next/image";

export default function CriticalStockModal({ isOpen, onClose, items }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-modal-background w-full max-w-6xl rounded-lg p-8 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h4 className="text-xl font-black font-headline uppercase italic text-font-color">
            Critical Stock Alert
          </h4>
          <button
            onClick={onClose}
            className="material-symbols-outlined opacity-50 hover:opacity-100"
          >
            close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {items.length > 0 ? (
            <div className=" bg-white/[0.02]  border border-secondary-container  rounded-lg  overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[600px] ">
                <thead>
                  <tr className="border-b border-white/[0.05] bg-black/40 ">
                    <th className="px-6 py-4 text-md text-center font-black font-headline uppercase tracking-[0.2em] text-primary-container">
                      Product
                    </th>
                    <th className="px-6 py-4 text-md  text-center font-black font-headline uppercase tracking-[0.2em] text-primary-container">
                      Brand
                    </th>
                    <th className="px-6 py-4  text-md text-center font-black font-headline uppercase tracking-[0.2em] text-primary-container">
                      Current Stock
                    </th>
                    <th className="px-6 py-4  text-md text-center font-black font-headline uppercase tracking-[0.2em] text-primary-container">
                      Reorder At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.item_image || "/placeholder-car.png"}
                            alt={item.item_name}
                            width={50}
                            height={50}
                            className="object-cover rounded bg-black/40 border border-white/10 shrink-0"
                            loading="lazy"
                          />
                          <p className="text-sm text-center font-bold uppercase truncate max-w-[200px] sm:max-w-xs">
                            {item.item_name}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-md opacity-60 uppercase font-bold tracking-wider text-center">
                          {item.brand}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-red-500 font-black text-lg bg-primary-container/10 px-3 py-1 rounded">
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-md opacity-60 italic font-bold">
                          {item.reorder_point || 5}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-6xl opacity-20 mb-4">
                inventory_2
              </span>
              <p className="text-sm opacity-60 italic uppercase tracking-widest font-bold">
                No critical stock items found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
