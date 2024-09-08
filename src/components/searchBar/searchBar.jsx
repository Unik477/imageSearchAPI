import { useCallback, useEffect, useRef, useState } from "react";
import "./searchBar.css";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";

export default function SearchBar() {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPages] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  //   console.log("key", process.env.REACT_APP_API_KEY);
  const text = useRef(null);
  // const search_text=(text.current.value== null)? "": text.current.value 
  const getImage = useCallback(async () => {
    if (text.current.value) {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}?query=${text.current.value}&page=${page}&per_page=20&client_id=${process.env.REACT_APP_API_KEY}`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      } catch (error) {
        alert(error.message);
        console.log("Error is", error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [page]);

  useEffect(() => {
    getImage();
  }, [getImage]);

  function handleClick(e) {
    e.preventDefault();
    text.current.blur() //hide keyboard
    console.log(text.current.value);
    getImage();
    setPages(1);
  }

  function handleSuggestion(suggestion) {
    text.current.value = suggestion;
  }
  return (
    <>
      <div id="search">
        <div className="search-container">
          <h2>IMAGE SEARCH</h2>
          <form className="search-form" action="submit" onSubmit={handleClick}>
            <div className="input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input ref={text} type="text" placeholder="type something..." />
            </div>
            <button className="submit-btn">SEARCH</button>
            <h5>Search Suggestions</h5>
            <section className="search-suggestions">
              <button
                onClick={() => handleSuggestion("cats")}
                className="suggestion-btn"
              >
                Cats
              </button>
              <button
                onClick={() => handleSuggestion("Aurora Borealis")}
                className="suggestion-btn"
              >
                Aurora Borealis
              </button>
              <button
                onClick={() => handleSuggestion("Lightroom Presets")}
                className="suggestion-btn"
              >
                Lightroom Presets
              </button>
              <button
                onClick={() => handleSuggestion("Nature")}
                className="suggestion-btn"
              >
                Nature
              </button>
            </section>
          </form>
        </div>
      </div>

      {/* //loader */}
      {loading && <div className="loader-container">
        <div className="loader"></div>
      </div>}
      

      {/* <h1 className="search-name">{search_text}</h1> */}

      <div className="images">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.urls.small}
            alt={image.alt_description}
            className="individual-image"
          />
        ))}
      </div>

        {/* Page navigation */}
      <div className="controller-buttons">
        <p>
          Showing Page:{" "}
          <b>
            {page} out of {totalPages}
          </b>
        </p>
        {page > 1 && (
          <button onClick={() => {setPages(page - 1)
            window.scrollTo({
              top: 0,
              behavior: "smooth"  // Smooth scrolling effect
          })
          }}>previous</button>
        )}
        
        {page < totalPages && (
          <button onClick={() => {setPages(page + 1)
            window.scrollTo({
              top: 0,
              behavior: "smooth"  // Smooth scrolling effect
          })
          }}>Next</button>
        )}
      </div>
    </>
  );
}
