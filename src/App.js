import React, { Component } from 'react';
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg'
import Gif from './gif';


// we pick out our props inside the header component
// we can pass down functinos as props as well as things
// like numbers, strings, arrays or objects

const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results, show the clear button, else show the title */}
    {hasResults ? <button onClick={clearSearch}>
      <img src={clearButton} alt=''/>
    </button> : <h1 className="title">Jiffy</h1>}
  </div>
)

const UserHint = ({loading, hintText}) => (
  <div className="user-hint">
    {loading ? <img className="block mx-auto" src={loader} alt='' /> : hintText}
  </div>
)

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchTerm: '',
      hintText: '',
      // array of gifs
      gifs: []
    };
  }


  searchGiphy = async searchTerm => {
    // first we try our fetch
    this.setState({
      // here we set our loading state to be true
      // and this will show the spinner at the bottom
      loading: true

    })
    try {
      // here we use await keyword to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=c4GpuGoBsD170hRFFDGrVS1ZZlMGnWTo&q=${searchTerm}&limit=25&offset=0&rating=pg&lang=en`);
      // convert our raw response into json data
      const {data} = await response.json();
      // check if array of results is empty
      // if it is, we throw an error which will stop the
      // code here and handle it in the catch area
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      // grab a random result from our images
      const randomGif = randomChoice(data)

      this.setState((prevState, props) => ({
        ...prevState,
        // get the first result and put it in the state
        // here we use our spread
        // spread them out and then add our new random gif
        // onto the end
        gifs: [...prevState.gifs, randomGif],
        // we turn off our loading spinner again
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`

      }));
      // if our fetch fails, we catch it down here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
    }

  }

  // with create react app, we can write our methods as arrow
  // functions, meaning we don't need the constructor and bind
  handleChange = event => {
    const {value} = event.target;
    this.setState((prevState, props) => ({
      // we take out old props and spread them out here
      ...prevState,
      // and then we overwrite the ones we want after
      searchTerm: value,
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }))
    if (value.length > 2) {
    }
  };

  handleKeyPress = event => {
    const {value} = event.target;
    // by setting the searchTerms in our state and also using that
    // on the input as the value, we have created what is called
    // a controlled input
    console.log(event.key)
    // when we have 2+ characters in our searchbox
    // and we have also pressed enter, we want to run a search
    if (value.length > 2 && event.key === "Enter") {
      // call searchGiphy function
      this.searchGiphy(value);
    }
  }

  // here we reset our state by clearing everything out and
  // making it default again (like in default state)
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }))
    this.textInput.focus();
  }



  render() {
    const { searchTerm, gifs} = this.state
    // here we set a variable to see if we have any gifs
    const hasResults = gifs.length;

    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults={hasResults} />
        <div className="search grid">
          {/* our stack of gif images */}
          {/* here we loop over our array of gif images from out state
          and we create multiple videos */}
          {this.state.gifs.map(gif => (
            // we spread out all of our properties onto our Gif component
            <Gif {...gif}/>
          ))}
          <input
            className="input grid-item"
            placeholder= "Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={(input) => {
              this.textInput = input;
            }}
          />
        </div>
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
