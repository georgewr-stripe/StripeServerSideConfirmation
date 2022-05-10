import Router from 'next/router'


export default () => {
  
  return (<>
    <h3 className="text text-lg">Succeeded! 😁 👍</h3>
    <button
        type="button"
        onClick={() => Router.push('/')}
        className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Go Again!
      </button>
  </>)
  
}