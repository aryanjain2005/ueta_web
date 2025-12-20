import ContactButton from "@components/contact-button";
import { DDDialog } from "@components/dd-dialog";
import type { Product } from "types";

interface Props {
  bussiness: Product["distributors"][number] | Product["dealers"][number];

  className?: string;
  size?: "normal" | "small";
  children?: any;
  useDialog?: boolean;
}

const DDItem = ({
  bussiness,
  className = "",
  size = "normal",
  children,
  useDialog = false,
}: Props) => {
  const content = (
    <div className={`flex-col flex gap-1 items-center ${className}`}>
      {bussiness.image && (
        <div
          className={`flex items-center justify-center ${
            size == "normal" ? "w-[160px] h-[160px] " : "w-[100px] h-[100px] "
          }`}>
          <img
            src={bussiness.image}
            alt={bussiness.name}
            className="rounded-md  object-cover"
            loading="lazy"
          />
        </div>
      )}
      <h2 className="tracking-tight font-medium text-2xl">{bussiness.name}</h2>
      <h5 className="tracking-tight text-lg">{bussiness.shopName}</h5>
      {children}
      {bussiness.contact && bussiness.contact.length > 0 && (
        <div className="flex gap-3 ">
          {bussiness.contact.map((c, index) => (
            <ContactButton key={index} contact={c} />
          ))}
        </div>
      )}
    </div>
  );

  return useDialog ? (
    <DDDialog bussiness={bussiness}>{content}</DDDialog>
  ) : (
    <a href={`/${bussiness.type}/${bussiness.slug}`}>{content}</a>
  );
};

export default DDItem;
