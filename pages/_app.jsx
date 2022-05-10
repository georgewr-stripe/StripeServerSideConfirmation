import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
	return (
    <div className='h-screen'>
			<div className="h-full  pt-16 pb-12 flex flex-col bg-white">
				<div className="flex-grow flex flex-col justify-center max-w-7xl w-70 mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className='text mb-4 text-lg'>Server Side Confirmation Demo</h2>
					<Component {...pageProps} />
				</div>
			</div>
      </div>
	);
}
