function parts(){
    return(
        <>
         <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
        <ul className="marquee__content" >
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>

          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
        </ul>

        <ul className="marquee__content" aria-hidden="true">
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>

          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
        </ul>
      </div>
{/* dots */}
      <div className="absolute hidden sm:flex  justify-center mt-8 gap-5 " role="tablist" aria-label="Select artwork">
          {artworks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002]' : 'bg-gray-400'} cursor-pointer`}
              aria-label={`Go to artwork ${i + 1}`}
            />
          ))}
        </div>
        </>
    )
}
     