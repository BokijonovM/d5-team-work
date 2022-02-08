CREATE TABLE IF NOT EXISTS 
    products(
        product_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        product_name VARCHAR(100) NOT NULL,
        product_desc TEXT NOT NULL,
        product_brand VARCHAR(50) NOT NULL,
        product_price INT NOT NULL,
        product_category VARCHAR(50) NOT NULL,
        cover VARCHAR(255) DEFAULT 'https://picsum.photos/900/600',
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  

CREATE TABLE IF NOT EXISTS
    reviews(
        review_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        comment TEXT NOT NULL,
        review_rate INT NOT NULL,
        product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
    )