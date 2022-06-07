const TrafficLight = () => {
  const className =
    'mr-2 h-3 w-3 rounded-full last-of-type:mr-0 dark:bg-white/20'
  return (
    <div className='flex'>
      <div className={className}></div>
      <div className={className}></div>
      <div className={className}></div>
    </div>
  )
}

export default TrafficLight