import { useState } from "react";


const FAQ = () => {
  const [isContentVisible, setIsContentVisible] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  // Hàm xử lý sự kiện click để hiển thị nội dung của câu hỏi cụ thể
  const handleClick = (index: any) => {
    const newIsContentVisible = [...isContentVisible];
    newIsContentVisible[index] = !newIsContentVisible[index];
    setIsContentVisible(newIsContentVisible);
  };
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
              <a href="#">FAQs</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-20">
        <div className="p-4 mt-10">
          <p className="text-lg font-bold mb-2">Frequently Asked Questions</p>
          <p>Close contact with customers by frequently asked questions</p>
        </div>
        <div className="grid grid-cols-3">
          <div className="grid *:mt-2 col-span-2">
            {isContentVisible.map((isVisible, index) => (
              <div key={index} className="*:mt-1 col-span-2">
                <div className="">
                  <div
                    className="bg-gray-300 text-black p-5 flex justify-between items-center cursor-pointer"
                    onClick={() => handleClick(index)}
                  >
                    <span>
                      {index === 0 && "What is Shopify?"}
                      {index === 1 && "How do I setup my store?"}
                      {index === 2 &&
                        "Do I need a Designer/Programmer for my store?"}
                      {index === 3 &&
                        "When you purchase a theme is that a one-time fee?"}
                      {index === 4 &&
                        "What if I need help with Shopify issues?"}
                    </span>
                    {isVisible ? <span>-</span> : <span>+</span>}
                  </div>
                  {isVisible && (
                    <div className="p-5 font-light">
                      {index === 0 &&
                        "Shopify is the world’s most powerful e-commerce platform that allows anyone to easily sell online, at a retail location, and everywhere in between."}
                      {index === 1 &&
                        "When you buy this theme you get full access to our comprehensive and easy to follow instructions on setting up the theme for your store. If you’re looking for more generic Shopify store setup instructions, there are plenty of resources available on Shopify’s own website."}
                      {index === 2 &&
                        "We’ve designed the theme to be as flexible and configurable as possible but also made it simple to use. You would only need a designer/developer if you wanted to custom code something that the theme doesn’t do natively."}
                      {index === 3 &&
                        "Yes, unlike other themes, you get free upgrades and support for 6-months and you only pay a one-time fee, unless stated otherwise."}
                      {index === 4 &&
                        "General shop inquiries, such as uploading products, creating collections, adding discount codes, managing domains, etc. can be best addressed by reaching Shopify Support specifically and/or by checking on their broad documentation accessible in the Shopify Manual."}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-1 p-3 ml-5">
            <form action="" className="">
              <div className="mb-5">
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Enter your name"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border border-gray-500 p-3 rounded-md "
                />
              </div>
              <div className="mb-5">
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border border-gray-500 p-3 rounded-md "
                />
              </div>
              <div className="mb-5">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  placeholder="Enter your phone number"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border border-gray-500 p-3 rounded-md "
                />
              </div>
              <div className="mb-5">
                <textarea
                  name="comment"
                  id="comment"
                  placeholder="Enter your comment"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm  border border-gray-500 p-3 h-24 rounded-md "
                ></textarea>
              </div>
              <button
                type="submit"
                className="inline-flex justify-center w-full h-12 py-2 px-5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-700 hover:bg-amber-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
