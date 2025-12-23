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
      className="w-full min-h-[150px] flex flex-col justify-between p-4">
      <div className="max-sm:flex-col flex gap-3 items-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md drop-shadow-md overflow-hidden flex-shrink-0">
          <img src={bussiness.image || ""} className="object-cover" />
        </div>
        <CardContent>
          <div className="space-y-2">
            <CardTitle className="text-xl ">{bussiness.shopName}</CardTitle>
            <CardDescription>{bussiness.address}</CardDescription>
            {bussiness.contacts.map((contact) => (
              <ContactButton
                key={contact.value}
                size="large"
                contact={contact}
              />
            ))}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};
