import { Button, Link } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SideBar = () => {
  const [tab, setTab] = useState("");

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const tabs = ["products", "orders", "add-product"];

  return (
    <div className="flex flex-col gap-2 px-6 py-5 ">
      {tabs.map((t, idx) => (
        <Button
          href={`/admin-dashboard?tab=${t}`}
          color="primary"
          variant={tab === t ? "solid" : "light"}
          key={idx}
          as={Link}
          className="justify-start"
        >
          {t.replace(/^./, t[0].toUpperCase()).split("-").join(" ")}
        </Button>
      ))}
    </div>
  );
};

export default SideBar;
