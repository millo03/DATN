
const Delivery = () => {
  return (
    <div className="container mx-auto max-w-[1200px]">
      <div>
        <div className="flex items-center bg-gray-100 h-20 p-4 mx-w-[1200px]">
          <ul className="flex gap-2">
            <li className="text-red-500">
              <a href="#">Home </a>
            </li>
            <li> / </li>
            <li>
              <a href="#">Delivery</a>
            </li>
          </ul>
        </div>
        <div className="p-5 mb-20 ">
          <h1 className="text-2xl text-pretty font-semibold font_text ">
            Shipments and returns
          </h1>
          <h2 className="text-xl font_text">Your pack shipment</h2>
          <div className="*:small-text *:text-gray-500 font_text">
            <nav className=" leading-loose">
              Packages are generally dispatched within 2 days after receipt of
              payment and are shipped via UPS with tracking and drop-off without
              signature. If you prefer delivery by UPS Extra with required
              signature, an additional cost will be applied, so please contact
              us before choosing this method. Whichever shipment choice you
              make, we will provide you with a link to track your package
              online.
            </nav>
            <nav className=" leading-loose">
              Shipping fees include handling and packing fees as well as postage
              costs. Handling fees are fixed, whereas transport fees vary
              according to total weight of the shipment. We advise you to group
              your items in one order. We cannot group two distinct orders
              placed separately, and shipping fees will apply to each of them.
              Your package will be dispatched at your own risk, but special care
              is taken to protect fragile objects.
            </nav>
            <nav className=" leading-loose">
              Boxes are amply sized and your items are well-protected.
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;
