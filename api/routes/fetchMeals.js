// Display all the data in the mealdb table
router.get("/" , async (req, res) => {
    try {
        const results = await client.query("SELECT * FROM meals");
        res.json(results.rows);
    } catch (error) {
        console.error(error);
        res.send("Error " + error);
    }
});