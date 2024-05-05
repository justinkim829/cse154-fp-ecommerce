/**
 * CONTEXT:
 * - #category, #question, #answer, #posts, and #trivia are all elements that
 * exist on the page, and that the button is inside of a form
 * - URL for the API is included within the code.
 * - Accepts POST requests with 3 required parameters:
 *   + category
 *   + question
 *   + answer.
 * - Responds in plain text with a message assuming a successful request.
 * - Valid category values for this API are:
 *   + astronomy
 *   + biology
 *   + chemistry
 *   + computerscience
 *   + culture
 *   + history
 *   + internet
 *   + other
 */
(function() {

  window.addEventListener('load', init);

  function init() {
    /** HINT: This button is in a <form> element */
    qsa('section button').addEventListener('click', makeRequest);
  }

  function makeRequest() {
    let c = id('category').value;
    let q = id('question').value;
    let a = id('answer').value;

    fetch('https://courses.cs.washington.edu/courses/cse154/webservices/trivia/trivia.php' + '?category=' + c + '?question=' + q + '?answer=' + a)
      .then(res => res.json())
      .then(() => {
        // naming conventions
        let c = id('category').value;
        let q = id('question').value;
        let a = id('answer').value;

        let container = gen('section');

        let p1 = gen('p');
        p1.innerHTML = 'category: ' + c;
        container.appendChild(p1);

        let p2 = gen('p');
        p2.innerHTML = 'question: ' + q;
        container.appendChild(p2);

        let p3 = gen('p');
        p3.innerHTML = 'answer: ' + a;
        container.appendChild(p3);

        id('trivia').appendChild(container);
      })
      .then(console.log);
  }

  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response;
  }

  function qsa(query) {
    return document.querySelectorAll(query);
  }

  function qs(query) {
    return document.querySelector(query);
  }

  function id(id) {
    return document.getElementById(id);
  }

  function gen(el) {
    return document.createElement(el);
  }

})();