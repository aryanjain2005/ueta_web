import ContactButton from "./contact-button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";

export const DDMoreInfo = ({
  bussiness,
  type,
}: {
  bussiness: {
    name: string;
    slug: string;
    image: string | null;
    shopName: string;
    address: string | null;
    contacts: {
      type: "phone" | "email" | "whatsapp" | "facebook" | "instagram";
      value: string;
    }[];
  };
  type: "dealer" | "distributor";
}) => {
  return (
    <Card
      onClick={() => {
        // redirect to the bussiness page
        window.location.pathname = `/${type}/${bussiness.slug}`;
      }}
      className="w-full h-[280px] sm:h-[180px] flex flex-col justify-center md:p-4 p-3">
      <div className="flex max-sm:flex-col max-sm:items-center sm:items-center gap-3 items-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-32 md:h-32 rounded-md drop-shadow-md overflow-hidden flex-shrink-0">
          <img
            src={bussiness.image || ""}
            className="w-full h-full object-cover"
          />
        </div>
        <CardContent className="p-0 flex-1 flex flex-col max-sm:justify-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl flex flex-col max-sm:items-center">
              {bussiness.shopName}
            </CardTitle>
            <CardDescription
              className={
                "text-xs sm:text-sm " +
                (bussiness.contacts.length > 0
                  ? "line-clamp-2"
                  : "line-clamp-3")
              }>
              {bussiness.address}
            </CardDescription>
          </div>
          {bussiness.contacts.length > 0 && (
            <div className="mt-2 flex flex-row flex-wrap justify-center sm:justify-start gap-0.5 text-xs sm:text-sm">
              {bussiness.contacts.map((contact) => (
                <ContactButton
                  key={contact.value}
                  size="normal"
                  contact={contact}
                />
              ))}
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};
