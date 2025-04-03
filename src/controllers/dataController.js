class DataController {
    constructor(dataService) {
        this.dataService = dataService;
    }

    async fetchData(req, res) {
        try {
            const data = await this.dataService.scrapeData();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching data', error: error.message });
        }
    }

    sendData(req, res) {
        const formattedData = this.dataService.formatData(req.body);
        res.status(200).json(formattedData);
    }
}

export default DataController;