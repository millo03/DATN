import React, { createContext, useState } from 'react';

const BlogContext = createContext<{ contentNew: any; setContentNew: React.Dispatch<any>; }>({ contentNew: "", setContentNew: () => {} });

export const BlogProvider = ({ children }: any) => {
  const [contentNew, setContentNew] = useState<any>("");

  return (
    <BlogContext.Provider value={{ contentNew, setContentNew }}>
      {children}
    </BlogContext.Provider>
  );
};

export default BlogContext;
