package api

type Client struct {
	BaseURL string
	HTTPClient *http.Client
}

func NewClient(baseURL string) *Client {
	return &Client{
		BaseURL: baseURL,
		HTTPClient: &http.Client{},
	}
}

func GetResume(c *Client) (*Resume, error) {
	url := fmt.Sprintf("%s/resume", c.BaseURL)
	response, err := c.HTTPClient.Get(url)
	if err != nil {
		return nil, err
	}

	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, err
	}
	
	return &Resume{Body: string(body)}, nil
}