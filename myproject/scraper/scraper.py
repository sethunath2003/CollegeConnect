import requests
from bs4 import BeautifulSoup

def scrape_allhacks():
    url = "https://reskilll.com/allhacks"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Extract the required information
    hackathons = []
    for card in soup.find_all('div', class_='hackathonCard'):
        hackathon = {}
        hackathon['title'] = card.find('a', class_='allhackname').text if card.find('a', class_='allhackname') else 'No Title'
        hackathon['location'] = card.find('div', class_='col-12').text.strip() if card.find('div', class_='col-12') else 'No Location'
        hackathon['date'] = card.find('span', class_='date').text if card.find('span', class_='date') else 'No Date'
        hackathon['description'] = card.find('div', class_='eventDescription').text if card.find('div', class_='eventDescription') else 'No Description'
        hackathon['registration_start'] = card.find('div', class_='hackresgiterdate').text if card.find('div', class_='hackresgiterdate') else 'No Registration Start'
        hackathon['registration_end'] = card.find_all('div', class_='hackresgiterdate')[1].text if len(card.find_all('div', class_='hackresgiterdate')) > 1 else 'No Registration End'
        hackathons.append(hackathon)
    
    return hackathons
