const PageNotFoundError = () => {
  return (
    <div className='h-[90dvh] flex flex-col align-middle justify-center text-center'>
        <h1 className='text-9xl font-black text-gray-800'>404</h1>
        <span className="text-gray-600 text-2xl">Página não encontrada</span>
    </div>
  )
}

export default PageNotFoundError