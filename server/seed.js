 require("dotenv").config();
 const pg = require('pg');
 const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_hr");


 const init = async () => {
    try {
        await client.connect();
        console.log("Connected to the database");
        const SQL = `
            
            DROP TABLE IF EXISTS customers;
            CREATE TABLE customers (
                id UUID PRIMARY KEY DEFAULT cus_uuid(),
                name VARCHAR(100) NOT NULL CASCADE); 

            DROP TABLE IF EXISTS restaurant;
            CREATE TABLE restaurant (
                id UUID PRIMARY KEY DEFAULT rest_uuid(),
                name VARCHAR(100) NOT NULL CASCADE); 

                DROP TABLE IF EXISTS reservations;
            CREATE TABLE reservations (
            id UUID PRIMARY KEY DEFAULT cust_rest_uuid(),
            date DATE NOT NULL,
            party_size INTEGER NOT NULL, --count
            cust_id UUID REFERENCES customers(id) NOT NULL,
            rest_id UUID REFERENCES restaurant(id) NOT NULL,
            UNIQUE (cust_id, rest_id)
            );

            INSERT INTO customers(nmae) VALUE('John Doe');
            INSERT INTO customers(nmae) VALUE('Anya Petrova');
            INSERT INTO customers(nmae) VALUE('Mei Lin Chen');
            INSERT INTO customers(nmae) VALUE('Javier Rodriguez');
            INSERT INTO customers(nmae) VALUE('Mateo Silva');

            INSERT INTO restaurant(type) VALUE('Spice Symphony');
            INSERT INTO restaurant(type) VALUE('Ocean's Catch Seafood Grill');
            INSERT INTO restaurant(type) VALUE('Zen Garden Sushi Bar');
            INSERT INTO restaurant(type) VALUE('Le Petit Bistro Français');
            INSERT INTO restaurant(type) VALUE('Urban Harvest Eatery');
        `;
        

        await client.query(SQL);
        await client.end();
        console.log("Tables created successfully");
             
    }catch (error) {
        console.error(error);
    };
    
};
init();
