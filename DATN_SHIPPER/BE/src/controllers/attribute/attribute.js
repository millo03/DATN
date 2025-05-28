// import attribute from "../../models/attribute.js/attribute";

import attribute from "../../models/attribute/attribute";

// //Controller để tạo mới 1 thuộc tính
// export const createAttribute = async (req, res) => {
//     try {
//         const {name} = req.body;
//         const newattribute = new attribute({name});
//         const newAttribute = await newattribute.save();
//         res.status(201).json(newAttribute);
//     } catch (error) {
//         res.status(400).json({message: error.message})
//     }
// }

// // Controller để lấy tất cả các thuộc tính
export const getAllAttributes = async (req, res) => {
  try {
    // Fetch attributes and populate related fields
    const attributes = await attribute.find().populate("values");

    // Initialize sets to collect unique colors and sizes
    const colorsSet = new Set();
    const sizesSet = new Set();

    // Iterate over attributes and collect unique colors and sizes
    attributes.forEach((attr) => {
      attr.values.forEach((value) => {
        if (value.color) {
          colorsSet.add(value.color.trim().toLowerCase()); // Normalize and add color
        }
        if (value.size) {
          value.size.forEach((size) => {
            if (size.name_size) {
              sizesSet.add(size.name_size.trim().toLowerCase()); // Normalize and add size
            }
          });
        }
      });
    });

    // Convert sets to arrays
    const colors = Array.from(colorsSet);
    const sizes = Array.from(sizesSet);

    // Respond with the unique colors and sizes
    res.json({
      colors,
      sizes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// // Controller để lấy một thuộc tính theo ID
export const getAttributeById = async (req, res) => {
  try {
    const attri = await attribute.findById(req.params.id).populate("values");
    if (!attri) {
      return res.status(404).json({ message: "Attribute not found" });
    }
    res.json(attri);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Controller để cập nhật một thuộc tính
// export const updateAttribute = async (req, res) => {
//     try {
//         const { name } = req.body;
//         const attribute = await attribute.findById(req.params.id);
//         if (!attribute) {
//             return res.status(404).json({ message: "Attribute not found" });
//         }
//         attribute.name = name;
//         const updatedAttribute = await attribute.save();
//         res.json(updatedAttribute);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Controller để xóa một thuộc tính
// export const deleteAttribute = async (req, res) => {
//     try {
//         const attribute = await attribute.findById(req.params.id);
//         if (!attribute) {
//             return res.status(404).json({ message: "Attribute not found" });
//         }
//         await attribute.remove();
//         res.json({ message: "Attribute deleted" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// //==================================== VALUE ============================================

// // Controller để tạo mới một giá trị của thuộc tính
// export const createValueAttribute = async (req, res) => {
//     try {
//         const { name, price, quantity } = req.body;
//         const attribute = await attribute.findById(req.params.id);
//         if (!attribute) {
//             return res.status(404).json({ message: "Attribute not found" });
//         }
//         const valueAttribute = new ValueAttributeModel({
//             name,
//             price,
//             quantity,
//         });
//         const newValueAttribute = await valueAttribute.save();
//         attribute.values.push(newValueAttribute);
//         await attribute.save();
//         res.status(201).json(newValueAttribute);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Controller để lấy tất cả các giá trị của thuộc tính
// export const getAllValueAttributes = async (req, res) => {
//     try {
//         const values = await ValueAttributeModel.find();
//         res.json(values);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Controller để lấy một giá trị của thuộc tính theo ID
// export const getValueAttributeById = async (req, res) => {
//     try {
//         const value = await ValueAttributeModel.findById(req.params.id);
//         if (!value) {
//             return res.status(404).json({ message: "ValueAttribute not found" });
//         }
//         res.json(value);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // Controller để cập nhật một giá trị của thuộc tính
// export const updateValueAttribute = async (req, res) => {
//     try {
//         const { name, price, quantity } = req.body;
//         const value = await ValueAttributeModel.findById(req.params.id);
//         if (!value) {
//             return res.status(404).json({ message: "ValueAttribute not found" });
//         }
//         value.name = name;
//         value.price = price;
//         value.quantity = quantity;
//         const updatedValue = await value.save();
//         res.json(updatedValue);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// // Controller để xóa một giá trị của thuộc tính
// export const deleteValueAttribute = async (req, res) => {
//     try {
//         const value = await ValueAttributeModel.findById(req.params.id);
//         if (!value) {
//             return res.status(404).json({ message: "ValueAttribute not found" });
//         }
//         await value.remove();
//         res.json({ message: "ValueAttribute deleted" });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // import attribute from "../../models/attribute.js/attribute";

// // //Controller để tạo mới 1 thuộc tính
// // export const createAttribute = async (req, res) => {
// //     try {
// //         const {name} = req.body;
// //         const newattribute = new attribute({name});
// //         const newAttribute = await newattribute.save();
// //         res.status(201).json(newAttribute);
// //     } catch (error) {
// //         res.status(400).json({message: error.message})
// //     }
// // }

// Controller để lấy tất cả các thuộc tính
// export const getAllAttributes = async (req, res) => {
//     try {
//         const attributes = await attribute.find().populate("values");
//         res.json(attributes);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// // // Controller để lấy một thuộc tính theo ID
// // export const getAttributeById = async (req, res) => {
// //     try {
// //         const attribute = await attribute.findById(req.params.id).populate("values");
// //         if (!attribute) {
// //             return res.status(404).json({ message: "Attribute not found" });
// //         }
// //         res.json(attribute);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// // // Controller để cập nhật một thuộc tính
// // export const updateAttribute = async (req, res) => {
// //     try {
// //         const { name } = req.body;
// //         const attribute = await attribute.findById(req.params.id);
// //         if (!attribute) {
// //             return res.status(404).json({ message: "Attribute not found" });
// //         }
// //         attribute.name = name;
// //         const updatedAttribute = await attribute.save();
// //         res.json(updatedAttribute);
// //     } catch (error) {
// //         res.status(400).json({ message: error.message });
// //     }
// // };

// // // Controller để xóa một thuộc tính
// // export const deleteAttribute = async (req, res) => {
// //     try {
// //         const attribute = await attribute.findById(req.params.id);
// //         if (!attribute) {
// //             return res.status(404).json({ message: "Attribute not found" });
// //         }
// //         await attribute.remove();
// //         res.json({ message: "Attribute deleted" });
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// // //==================================== VALUE ============================================

// // // Controller để tạo mới một giá trị của thuộc tính
// // export const createValueAttribute = async (req, res) => {
// //     try {
// //         const { name, price, quantity } = req.body;
// //         const attribute = await attribute.findById(req.params.id);
// //         if (!attribute) {
// //             return res.status(404).json({ message: "Attribute not found" });
// //         }
// //         const valueAttribute = new ValueAttributeModel({
// //             name,
// //             price,
// //             quantity,
// //         });
// //         const newValueAttribute = await valueAttribute.save();
// //         attribute.values.push(newValueAttribute);
// //         await attribute.save();
// //         res.status(201).json(newValueAttribute);
// //     } catch (error) {
// //         res.status(400).json({ message: error.message });
// //     }
// // };

// // // Controller để lấy tất cả các giá trị của thuộc tính
// // export const getAllValueAttributes = async (req, res) => {
// //     try {
// //         const values = await ValueAttributeModel.find();
// //         res.json(values);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// // // Controller để lấy một giá trị của thuộc tính theo ID
// // export const getValueAttributeById = async (req, res) => {
// //     try {
// //         const value = await ValueAttributeModel.findById(req.params.id);
// //         if (!value) {
// //             return res.status(404).json({ message: "ValueAttribute not found" });
// //         }
// //         res.json(value);
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };

// // // Controller để cập nhật một giá trị của thuộc tính
// // export const updateValueAttribute = async (req, res) => {
// //     try {
// //         const { name, price, quantity } = req.body;
// //         const value = await ValueAttributeModel.findById(req.params.id);
// //         if (!value) {
// //             return res.status(404).json({ message: "ValueAttribute not found" });
// //         }
// //         value.name = name;
// //         value.price = price;
// //         value.quantity = quantity;
// //         const updatedValue = await value.save();
// //         res.json(updatedValue);
// //     } catch (error) {
// //         res.status(400).json({ message: error.message });
// //     }
// // };

// // // Controller để xóa một giá trị của thuộc tính
// // export const deleteValueAttribute = async (req, res) => {
// //     try {
// //         const value = await ValueAttributeModel.findById(req.params.id);
// //         if (!value) {
// //             return res.status(404).json({ message: "ValueAttribute not found" });
// //         }
// //         await value.remove();
// //         res.json({ message: "ValueAttribute deleted" });
// //     } catch (error) {
// //         res.status(500).json({ message: error.message });
// //     }
// // };
