import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2"; // ✅ import SweetAlert2
import "sweetalert2/dist/sweetalert2.min.css";

const position = [23.685, 90.3563]; // Center of Bangladesh

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FlyToDistrict({ coords }) {
  const map = useMap();
  if (coords) map.flyTo(coords, 12, { duration: 1.5 });
  return null;
}

const BangladeshMap = ({ serviceCenters }) => {
  const [searchText, setSearchText] = useState("");
  const [activeDistrict, setActiveDistrict] = useState(null);
  const markerRefs = useRef({});

  useEffect(() => {
    if (activeDistrict && markerRefs.current[activeDistrict]) {
      markerRefs.current[activeDistrict].openPopup();
    }
  }, [activeDistrict]);

  const handleSearch = (e) => {
    e.preventDefault();
    const district = serviceCenters.find((d) =>
      d.district.toLowerCase().includes(searchText.toLowerCase())
    );
    if (district) {
      setActiveDistrict(district.district);
    } else {
      // ✅ SweetAlert2 instead of alert()
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `District "${searchText}" not found!`,
        confirmButtonColor: "#3085d6",
      });
      setActiveDistrict(null);
    }
  };

  return (
    <div className="h-[800px] w-full rounded-lg overflow-hidden shadow-lg relative">
      {/* Search Box */}
      <form
        onSubmit={handleSearch}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-md px-4 flex bg-gray-200 rounded-md shadow"
      >
        <input
          type="text"
          placeholder="Type district name..."
          className="flex-1 px-4 py-2 border rounded-l-md outline-none"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
        >
          Go
        </button>
      </form>

      {/* Map */}
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {activeDistrict && (
          <FlyToDistrict
            coords={
              serviceCenters.find((d) => d.district === activeDistrict) && [
                serviceCenters.find((d) => d.district === activeDistrict)
                  .latitude,
                serviceCenters.find((d) => d.district === activeDistrict)
                  .longitude,
              ]
            }
          />
        )}

        {serviceCenters.map((center) => (
          <Marker
            key={center.district}
            position={[center.latitude, center.longitude]}
            icon={customIcon}
            ref={(el) => (markerRefs.current[center.district] = el)}
            eventHandlers={{
              mouseover: (e) => e.target.openPopup(),
              mouseout: (e) =>
                center.district !== activeDistrict && e.target.closePopup(),
            }}
          >
            <Popup
              className="!p-0 !shadow-xl !rounded-xl"
              closeButton={false}
              autoClose={false}
              closeOnClick={false}
            >
              <div className="bg-white rounded-xl shadow-lg p-4 w-64">
                <h3 className="text-lg font-bold mb-2">{center.district}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {center.covered_area.join(", ")}
                </p>
                {center.image && (
                  <img
                    src={center.image}
                    alt={center.district}
                    className="w-full h-24 object-cover rounded-md"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default BangladeshMap;
