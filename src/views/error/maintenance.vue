<template lang="pug">
svg(
  version="1.1"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  :viewBox="viewBox"
  :width="width"
  :height="svg.height"
)
  defs
    linearGradient#linearGradient-1(
      x1="-10.1317199%"
      y1="63.3532973%"
      x2="155.883059%"
      y2="65.4559882%"
    )
      stop(stop-color="#CFE8FF" offset="0%")
      stop(stop-color="#79B8EE" offset="100%")
    radialGradient#radialGradient-2(
      cx="50%"
      cy="0%"
      fx="50%"
      fy="0%"
      r="128.282828%"
      gradientTransform="translate(0.500000,0.000000),scale(1.000000,0.779528),rotate(90.000000),scale(1.000000,0.406766),translate(-0.500000,-0.000000)"
    )
      stop(stop-color="#FFFFFF" offset="0%")
      stop(stop-color="#F4F2F2" offset="100%")
    linearGradient#linearGradient-3(
      x1="12.5166616%"
      y1="50%"
      x2="84.1059559%"
      y2="50%"
    )
      stop(stop-color="#DFDDDD" offset="0%")
      stop(stop-color="#F3F0F0" offset="51.4340044%")
      stop(stop-color="#DFDDDD" offset="100%")
    circle#path-4(cx="40" cy="40" r="40")
    filter#filter-5(
      x="-6.9%"
      y="-6.9%"
      filterUnits="objectBoundingBox"
      width="113.8%"
      height="113.8%"
    )
      feMorphology(
        radius="2.5"
        operator="dilate"
        in="SourceAlpha"
        result="shadowSpreadOuter1"
      )
      feOffset(
        dx="0"
        dy="0"
        in="shadowSpreadOuter1"
        result="shadowOffsetOuter1"
      )
      feGaussianBlur(
        stdDeviation="1"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feComposite(
        in="shadowBlurOuter1"
        in2="SourceAlpha"
        operator="out"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.939990942   0 0 0 0 0.935029481   0 0 0 0 0.935029481  0 0 0 1 0"
        in="shadowBlurOuter1"
      )
    filter#filter-6(
      x="-11.2%"
      y="-11.2%"
      filterUnits="objectBoundingBox"
      width="122.5%"
      height="122.5%"
    )
      feGaussianBlur(
        stdDeviation="4.5"
        in="SourceAlpha"
        result="shadowBlurInner1"
      )
      feOffset(dx="0" dy="0" in="shadowBlurInner1" result="shadowOffsetInner1")
      feComposite(
        in="shadowOffsetInner1"
        in2="SourceAlpha"
        operator="arithmetic"
        k2="-1"
        k3="1"
        result="shadowInnerInner1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.626465815   0 0 0 0 0.685094408   0 0 0 0 0.731997283  0 0 0 1 0"
        in="shadowInnerInner1"
      )
    linearGradient#linearGradient-7(
      x1="14.5485515%"
      y1="25.8779204%"
      x2="70.8148908%"
      y2="64.9990504%"
    )
      stop(stop-color="#FFFFFF" stop-opacity="0.526184616" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0" offset="100%")
    linearGradient#linearGradient-8(
      x1="20.2858964%"
      y1="30.3015841%"
      x2="65.7825014%"
      y2="71.524659%"
    )
      stop(stop-color="#FFFFFF" stop-opacity="0.60317417" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0" offset="100%")
      stop(stop-color="#FFFFFF" stop-opacity="0" offset="100%")
    radialGradient#radialGradient-9(
      cx="31.8675489%"
      cy="-8.96623668%"
      fx="31.8675489%"
      fy="-8.96623668%"
      r="93.2833787%"
      gradientTransform="translate(0.318675,-0.089662),scale(0.626582,1.000000),rotate(90.000000),scale(1.000000,0.912106),translate(-0.318675,0.089662)"
    )
      stop(stop-color="#CE8F8F" offset="0%")
      stop(stop-color="#C77777" offset="100%")
    radialGradient#radialGradient-10(
      cx="50%"
      cy="48.0428688%"
      fx="50%"
      fy="48.0428688%"
      r="124.868842%"
      gradientTransform="translate(0.500000,0.480429),scale(1.000000,0.567335),rotate(90.000000),scale(1.000000,0.440072),translate(-0.500000,-0.480429)"
    )
      stop(stop-color="#000000" stop-opacity="0" offset="0%")
      stop(stop-color="#000000" offset="100%")
    radialGradient#radialGradient-11(
      cx="50%"
      cy="28.3077172%"
      fx="50%"
      fy="28.3077172%"
      r="48.6902241%"
      gradientTransform="translate(0.500000,0.283077),scale(0.554324,1.000000),rotate(90.000000),scale(1.000000,0.405924),translate(-0.500000,-0.283077)"
    )
      stop(stop-color="#C6D8E6" offset="0%")
      stop(stop-color="#B4C4D1" offset="70.1368341%")
      stop(stop-color="#A4B4C2" offset="100%")
    linearGradient#linearGradient-12(
      x1="47.9500453%"
      y1="37.3940549%"
      x2="50%"
      y2="43.5582332%"
    )
      stop(stop-color="#DEE8F0" offset="0%")
      stop(stop-color="#C2D4E2" offset="51.518501%")
      stop(stop-color="#ACBDCB" offset="100%")
    linearGradient#linearGradient-13(x1="50%" y1="0%" x2="50%" y2="100%")
      stop(stop-color="#FFFFFF" stop-opacity="0" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0.35" offset="5.39638461%")
      stop(stop-color="#CADFFD" offset="100%")
    linearGradient#linearGradient-14(x1="50%" y1="0%" x2="50%" y2="100%")
      stop(stop-color="#FFFFFF" stop-opacity="0" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0.35" offset="5.39638461%")
      stop(stop-color="#CADFFD" offset="100%")
    filter#filter-15(
      x="-20.7%"
      y="-13.1%"
      filterUnits="objectBoundingBox"
      width="142.9%"
      height="123.8%"
    )
      feOffset(dx="0" dy="-2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="4.5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.465656806   0 0 0 0 0.574159501   0 0 0 0 0.747763813  0 0 0 0.1 0"
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
      )
      feMerge
        feMergeNode(in="shadowMatrixOuter1")
        feMergeNode(in="SourceGraphic")
    radialGradient#radialGradient-16(
      cx="50%"
      cy="39.4162077%"
      fx="50%"
      fy="39.4162077%"
      r="347.019847%"
      gradientTransform="translate(0.500000,0.394162),scale(1.000000,0.279120),rotate(93.526172),scale(1.000000,0.196729),translate(-0.500000,-0.394162)"
    )
      stop(stop-color="#E6EFF1" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    filter#filter-17(
      x="-20.7%"
      y="-16.9%"
      filterUnits="objectBoundingBox"
      width="141.4%"
      height="133.8%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.462745098   0 0 0 0 0.517647059   0 0 0 0 0.529411765  0 0 0 0.1 0"
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
      )
      feMerge
        feMergeNode(in="shadowMatrixOuter1")
        feMergeNode(in="SourceGraphic")
    radialGradient#radialGradient-18(
      cx="56.8365852%"
      cy="56.9577383%"
      fx="56.8365852%"
      fy="56.9577383%"
      r="52.0024521%"
      gradientTransform="translate(0.568366,0.569577),scale(1.000000,0.824261),rotate(90.000000),scale(1.000000,0.729196),translate(-0.568366,-0.569577)"
    )
      stop(stop-color="#D6EBF0" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    radialGradient#radialGradient-19(
      cx="50%"
      cy="94.3237002%"
      fx="50%"
      fy="94.3237002%"
      r="54.2617549%"
      gradientTransform="translate(0.500000,0.943237),scale(0.312859,1.000000),rotate(90.000000),scale(1.000000,1.770387),translate(-0.500000,-0.943237)"
    )
      stop(stop-color="#7B98CB" offset="0%")
      stop(stop-color="#6983B0" offset="100%")
    radialGradient#radialGradient-20(
      cx="51.134104%"
      cy="62.0899137%"
      fx="51.134104%"
      fy="62.0899137%"
      r="50%"
      gradientTransform="translate(0.511341,0.620899),scale(0.207666,1.000000),rotate(90.000000),scale(1.000000,4.705728),translate(-0.511341,-0.620899)"
    )
      stop(stop-color="#FFFCFC" offset="0%")
      stop(stop-color="#F3F3F3" offset="100%")
    filter#filter-21(
      x="-15.0%"
      y="-16.7%"
      filterUnits="objectBoundingBox"
      width="130.0%"
      height="133.3%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.461457655   0 0 0 0 0.516065241   0 0 0 0 0.530627264  0 0 0 0.1 0"
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
      )
      feMerge
        feMergeNode(in="shadowMatrixOuter1")
        feMergeNode(in="SourceGraphic")
    radialGradient#radialGradient-22(
      cx="55.5761828%"
      cy="16.5668909%"
      fx="55.5761828%"
      fy="16.5668909%"
      r="63.8986981%"
      gradientTransform="translate(0.555762,0.165669),scale(0.913052,1.000000),rotate(90.000000),scale(1.000000,1.268587),translate(-0.555762,-0.165669)"
    )
      stop(stop-color="#E6EFF1" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    radialGradient#radialGradient-23(
      cx="-11.1489204%"
      cy="28.5448845%"
      fx="-11.1489204%"
      fy="28.5448845%"
      r="160.410033%"
      gradientTransform="translate(-0.111489,0.285449),scale(1.000000,0.595737),rotate(107.270690),scale(1.000000,0.535690),translate(0.111489,-0.285449)"
    )
      stop(stop-color="#E3F9FF" offset="0%")
      stop(stop-color="#8BCCDD" offset="84.5181922%")
      stop(stop-color="#86C5D5" offset="100%")
    radialGradient#radialGradient-24(
      cx="20.0877469%"
      cy="47.5450127%"
      fx="20.0877469%"
      fy="47.5450127%"
      r="100.321713%"
      gradientTransform="translate(0.200877,0.475450),scale(1.000000,0.595737),rotate(-8.071180),scale(1.000000,1.113039),translate(-0.200877,-0.475450)"
    )
      stop(stop-color="#8BCCDD" stop-opacity="0" offset="0%")
      stop(
        stop-color="#8BCCDD"
        stop-opacity="0.511909965"
        offset="63.9375366%"
      )
      stop(stop-color="#2D535C" offset="100%")
    radialGradient#radialGradient-25(
      cx="37.1733716%"
      cy="36.5012977%"
      fx="37.1733716%"
      fy="36.5012977%"
      r="201.961855%"
      gradientTransform="translate(0.371734,0.365013),scale(1.000000,0.387542),rotate(93.814603),translate(-0.371734,-0.365013)"
    )
      stop(stop-color="#FFFFFF" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0.530075393" offset="100%")
    radialGradient#radialGradient-26(
      cx="50%"
      cy="22.5052205%"
      fx="50%"
      fy="22.5052205%"
      r="67.1278636%"
      gradientTransform="translate(0.500000,0.225052),scale(0.261609,1.000000),rotate(90.000000),scale(1.000000,3.882487),translate(-0.500000,-0.225052)"
    )
      stop(stop-color="#D3F2F3" offset="0%")
      stop(stop-color="#A8DEE0" offset="52.7316434%")
      stop(stop-color="#79BBD0" offset="100%")
    rect#path-27(x="17.575" y="0" rx="5" width="56.425" height="14.7612903")
    filter#filter-28(
      x="-20.4%"
      y="-71.1%"
      filterUnits="objectBoundingBox"
      width="147.9%"
      height="282.9%"
    )
      feOffset(dx="2" dy="3" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="4"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.525022645   0 0 0 0 0.525022645   0 0 0 0 0.525022645  0 0 0 0.2 0"
        in="shadowBlurOuter1"
      )
    filter#filter-29(
      x="-20.0%"
      y="-21.4%"
      filterUnits="objectBoundingBox"
      width="140.0%"
      height="142.9%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.534956428   0 0 0 0 0.593528392   0 0 0 0 0.606544384  0 0 0 0.2 0"
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
      )
      feMerge
        feMergeNode(in="shadowMatrixOuter1")
        feMergeNode(in="SourceGraphic")
    radialGradient#radialGradient-30(
      cx="50%"
      cy="39.4162077%"
      fx="50%"
      fy="39.4162077%"
      r="170.734232%"
      gradientTransform="translate(0.500000,0.394162),scale(1.000000,0.570719),rotate(97.181261),scale(1.000000,0.196729),translate(-0.500000,-0.394162)"
    )
      stop(stop-color="#E6EFF1" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
  g#Symbols(stroke="none" stroke-width="1" fill="none" fill-rule="evenodd")
    g#Maintenance(transform="translate(16.000000, 24.000000)")
      g(transform="translate(-16.000000, -24.000000)")
        g#image
          path#Oval(
            d="M193.929075,587.09631 C218.05967,587.09631 246.236767,581.232091 246.236767,576.09631 C246.236767,570.960529 218.05967,566.09631 193.929075,566.09631 C169.79848,566.09631 150.236767,568.09631 150.236767,576.59631 C150.236767,585.09631 169.79848,587.09631 193.929075,587.09631 Z"
            fill="#BCDDFB"
          )
          path#bg(
            d="M407.459782,220.251039 C433.804733,241.487337 490.298239,275.549933 518.217,300.199019 C587.682138,362.70638 662.272004,459.37774 552.701145,543.486163 C530.915567,560.209137 442.857269,622.602046 329.811635,545.656712 C325.981746,543.049871 322.735043,541.473034 318.764774,540.054771 C312.579991,537.845435 304.156923,536.647326 294.889164,537.052262 C285.621404,537.457198 266.092834,538.669522 231.14417,527.420306 C160.817768,504.783765 86.5977456,492.060283 85.6780674,422.264466 C90.0598975,375.188522 137.708085,344.045474 149.36706,329.388582 C161.026036,314.73169 161.149293,313.322858 167.942237,294.891826 C171.576731,285.030495 170.925157,247.45713 182.183742,210.821386 C191.967687,178.984161 214.739684,149.118794 222.340969,142.310016 C229.942254,135.501239 244.417435,115.998134 275.464901,118.18972 C320.24653,122.709966 367.317892,177.014945 389.478571,202.31035 C393.431492,206.82243 404.016031,217.47508 407.459782,220.251039 Z"
            fill="url(#linearGradient-1)"
            transform="translate(346.980038, 350.618685) scale(-1, 1) rotate(-50.000000) translate(-346.980038, -350.618685) "
          )
          g#spaceship(transform="translate(233.697391, 188.096310)")
            g#body(transform="translate(43.539376, 171.000000)")
              path#Rectangle(
                d="M13.9393939,0 L124.060606,0 C133.353535,25.2493438 138,47.3425197 138,66.2795276 C138,85.2165354 128.707071,124.790026 110.121212,185 L27.8787879,185 C9.29292929,124.87419 0,85.3006992 0,66.2795276 C0,47.2583559 4.64646465,25.1651801 13.9393939,0 Z"
                fill="#DCDADA"
              )
              line#Line(
                x1="30.5"
                y1="178.5"
                x2="32.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line-Copy-3(
                x1="45.5"
                y1="178.5"
                x2="47.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line-Copy(
                x1="35.5"
                y1="178.5"
                x2="37.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line-Copy-4(
                x1="50.5"
                y1="178.5"
                x2="52.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line-Copy-2(
                x1="40.5"
                y1="178.5"
                x2="42.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line-Copy-5(
                x1="55.5"
                y1="178.5"
                x2="57.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              line#Line(
                x1="80.5"
                y1="178.5"
                x2="82.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(81.500000, 181.500000) scale(-1, 1) translate(-81.500000, -181.500000) "
              )
              line#Line-Copy-3(
                x1="95.5"
                y1="178.5"
                x2="97.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(96.500000, 181.500000) scale(-1, 1) translate(-96.500000, -181.500000) "
              )
              line#Line-Copy(
                x1="85.5"
                y1="178.5"
                x2="87.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(86.500000, 181.500000) scale(-1, 1) translate(-86.500000, -181.500000) "
              )
              line#Line-Copy-4(
                x1="100.5"
                y1="178.5"
                x2="102.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(101.500000, 181.500000) scale(-1, 1) translate(-101.500000, -181.500000) "
              )
              line#Line-Copy-2(
                x1="90.5"
                y1="178.5"
                x2="92.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(91.500000, 181.500000) scale(-1, 1) translate(-91.500000, -181.500000) "
              )
              line#Line-Copy-5(
                x1="105.5"
                y1="178.5"
                x2="107.5"
                y2="184.5"
                stroke="#C1BFBF"
                opacity="0.497193"
                stroke-linecap="round"
                stroke-linejoin="round"
                transform="translate(106.500000, 181.500000) scale(-1, 1) translate(-106.500000, -181.500000) "
              )
            g#body(transform="translate(13.539376, 95.000000)")
              path#Rectangle(
                d="M20,0 L178,0 C191.333333,34.6666667 198,65 198,91 C198,117 184.666667,171.333333 158,254 L40,254 C13.3333333,171.448888 0,117.115555 0,91 C0,64.8844455 6.66666667,34.5511121 20,0 Z"
                fill="url(#radialGradient-2)"
              )
              path#Path-6(
                d="M16,10 C43.6666667,12.6666667 71.3333333,14 99,14 C126.666667,14 154.333333,12.6666667 182,10"
                stroke="#DFDDDD"
              )
              path#Path-6(
                d="M13,19 C41.8333333,21.6666667 70.6666667,23 99.5,23 C128.333333,23 156.833333,21.6666667 185,19"
                stroke="url(#linearGradient-3)"
              )
              path#Path-6(
                d="M16,14 C43.6666667,16.6666667 71.3333333,18 99,18 C126.666667,18 154.333333,16.6666667 182,14"
                stroke="#C9C8C8"
                stroke-dasharray="1,5"
              )
              line#Line-2(
                x1="38.5"
                y1="243.5"
                x2="160.5"
                y2="243.5"
                stroke="#DFDDDD"
                stroke-linecap="square"
              )
              line#Line-2(
                x1="38.5"
                y1="248.5"
                x2="160.5"
                y2="248.5"
                stroke="#DFDDDD"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-dasharray="0,5"
              )
            g#window(transform="translate(71.539376, 142.000000)")
              g
                use(
                  fill="black"
                  fill-opacity="1"
                  filter="url(#filter-5)"
                  xlink:href="#path-4"
                )
                use(fill="#79839E" fill-rule="evenodd" xlink:href="#path-4")
                use(
                  fill="black"
                  fill-opacity="1"
                  filter="url(#filter-6)"
                  xlink:href="#path-4"
                )
                use(stroke="#FFFFFF" stroke-width="5" xlink:href="#path-4")
              path#Combined-Shape(
                d="M21.1585666,6.42814349 L37.5191277,20.1576278 L27.1306411,32.538144 L9.14417073,17.445546 C12.3464755,13.0024269 16.4382174,9.24301611 21.1585666,6.42814349 Z"
                fill="url(#linearGradient-7)"
                opacity="0.463730923"
              )
              path#Combined-Shape(
                d="M6.00520721,21.7644451 L37.8637652,48.4975581 L27.4752785,60.8780743 L1.62425288,39.1873222 C1.74915084,32.9201692 3.31543346,27.006579 6.00520721,21.7644451 Z"
                fill="url(#linearGradient-8)"
                opacity="0.463730923"
              )
            path#head(
              d="M112.539376,-2.84217094e-14 C132.923209,13.4980922 149.390687,28.2703242 161.941809,44.316696 C174.492932,60.3630678 184.358787,77.2575025 191.539376,95 C165.206043,97.6666667 138.87271,99 112.539376,99 C86.2060429,99 59.8727096,97.6666667 33.5393763,95 C39.5558874,78.8238424 49.4522827,61.9294077 63.2285622,44.316696 C77.0048416,26.7039842 93.4417797,11.9317522 112.539376,-2.84217094e-14 Z"
              fill="url(#radialGradient-9)"
            )
            path#Path-9(
              d="M112.539376,-2.84217094e-14 C151.714865,26.60246 178.381532,58.9357933 192.539376,97 C194.475908,102.206481 196.127156,107.61074 197.539376,112 C207.767064,143.788244 208.024679,145.367725 211.539376,177 C214.206043,201 200.87271,258.333333 171.539376,349 L146.539376,349 C171.206043,266.333333 182.87271,208 181.539376,174 C180.602802,150.117355 177.857004,120.566273 155.539376,73 C151.569927,64.5397857 137.236594,40.2064524 112.539376,-2.84217094e-14 Z"
              fill-opacity="0.05"
              fill="#000000"
            )
            path#darker(
              d="M112.539376,0 C132.923209,13.4980922 149.390687,28.2703242 161.941809,44.316696 C174.207679,59.9983775 183.908952,76.4900117 191.04563,93.7915984 L191.539376,95 C204.87271,129.666667 211.539376,160 211.539376,186 C211.539376,212 198.206043,266.333333 171.539376,349 L53.5393763,349 C26.8727096,266.448888 13.5393763,212.115555 13.5393763,186 C13.5393763,159.884445 20.2060429,129.551112 33.5393763,95 C39.5558874,78.8238424 49.4522827,61.9294077 63.2285622,44.316696 C77.0048416,26.7039842 93.4417797,11.9317522 112.539376,0 Z"
              fill="url(#radialGradient-10)"
              style="mix-blend-mode: darken"
              opacity="0.102606"
            )
            g#wing(transform="translate(0.000000, 267.000000)")
              path(
                d="M112.039376,0 L140.539376,34 L112.039376,125 L83.5393763,34 L112.039376,0 Z M189.435985,25.3159139 L223.582364,38.5358506 C223.634004,38.5558432 223.68508,38.5772618 223.735535,38.6000818 C225.24516,39.2828683 225.915445,41.0601693 225.232659,42.5697946 L225.232659,42.5697946 L197.448467,104 L197.343978,103.910914 L187.789376,125 L182.599978,91.3919139 L171.539376,82 L189.435985,25.3159139 Z M36.063993,25.3159139 L53.9606016,82 L42.9,91.3910118 L37.7106016,125 L28.156,103.910012 L28.0515107,104 L0.267319123,42.5697946 C-0.415467432,41.0601693 0.254817802,39.2828683 1.7644431,38.6000818 C1.81489744,38.5772618 1.86597393,38.5558432 1.91761388,38.5358506 L36.063993,25.3159139 Z"
                stroke="url(#linearGradient-12)"
                fill="url(#radialGradient-11)"
              )
              polygon#Path(
                fill="#A1B1BE"
                points="34.5393763 26 4.53937627 43 36.5393763 126 0.539376265 41"
              )
              polygon#Path(
                fill="#A1B1BE"
                transform="translate(206.539376, 76.000000) scale(-1, 1) translate(-206.539376, -76.000000) "
                points="222.539376 26 192.539376 43 224.539376 126 188.539376 41"
              )
              polygon#Path-7(
                fill="#A1B1BE"
                points="111.539376 3 84.5393763 34.2627119 111.539376 122 87.7793763 35.2711864"
              )
              polygon#Path-7(
                fill="#A1B1BE"
                transform="translate(126.039376, 62.500000) scale(-1, 1) translate(-126.039376, -62.500000) "
                points="139.539376 3 112.539376 34.2627119 139.539376 122 115.779376 35.2711864"
              )
          g#water(
            transform="translate(247.236767, 355.096310)"
            fill-rule="nonzero"
          )
            path(
              d="M35,3.55271368e-14 L36,12 L42,13 L44,23 L47,27 C48.3333333,33.6666667 50.3333333,39 53,43 C55.6666667,47 60.6666667,52.6666667 68,60 C67.9962243,60.3458068 67.9926456,60.6862773 67.989264,61.0214113 L68,61 C70.6666667,72.3333333 71.3333333,79.3333333 70,82 C69.402996,83.194008 68.8445735,83.9424988 68.3034812,84.4050577 C68.4098755,88.5779202 68.3869012,90.8396454 68,91 C67.9501461,91.0206624 67.887523,91.0502505 67.8138225,91.0863846 L67.5611808,91.2120447 C66.9491185,91.5165435 65.9405172,91.9970558 65,92 C63.8150436,92.0037094 62.764793,91.1949459 61.3723473,91.1391072 C59.7292628,91.0732176 57.1264759,94 56,94 C54.9579335,94 54.1625674,94.3452053 53.3712745,94.7623834 C51.8298658,95.5750305 50.3039131,96.6607826 47,96 C42,95 41.9713683,91.2285668 39,91 C36.0286317,90.7714332 36.8949545,89.0071089 36,89 C35.2646284,88.9941587 34.2646284,89.327492 33,90 L32,53 L22,53 L18,54 L12,53 L13,55 L5,55 C3.63771793,50.3190704 2.63771793,45.985737 2,42 C1.36228207,38.014263 1.02894874,34.014263 1,30 L1.20792265e-13,17 L1.20792265e-13,3.55271368e-14 L35,3.55271368e-14 Z"
              fill="url(#linearGradient-13)"
            )
            path#Path-11(
              d="M32.6966726,38 C33.212506,58.7500199 33.212506,69.3105234 32.6966726,69.6815107 C32.4471019,69.8610019 31.6541828,70.6995601 30.9298333,70.7034949 C30.2319575,70.7072859 29.6134162,69.8807424 28.7933402,69.8236761 C27.8256515,69.7563379 26.2927495,72.7474634 25.6293155,72.7474634 C25.0155941,72.7474634 24.5471661,73.1002577 24.081137,73.5266071 C23.1733299,74.3571197 22.2746255,75.4667412 20.3287976,74.7914318 C17.3840655,73.7694476 17.3672029,69.9151024 15.6172262,69.6815107 C13.8672495,69.4479191 14.3774672,67.6448075 13.8503869,67.6375423 C13.4172925,67.6315725 12.828346,67.972234 12.0835476,68.6595265 L12.1438739,38.5017555 L32.6966726,38 Z"
              fill="url(#linearGradient-14)"
              transform="translate(22.583548, 56.500000) scale(-1, 1) translate(-22.583548, -56.500000) "
            )
          g#star(transform="translate(222.236767, 359.096310)")
            path#Rectangle(
              d="M13.7867966,2 C15.1794239,3.53846154 16.6409624,4.30769231 18.1714119,4.30769231 C19.7018615,4.30769231 21.2403231,3.53846154 22.7867966,2 C21.248335,3.60737266 20.4791043,5.1458342 20.4791043,6.61538462 C20.4791043,8.08493503 21.248335,9.54647349 22.7867966,11 C21.1794239,9.46153846 19.6409624,8.69230769 18.1714119,8.69230769 C16.7018615,8.69230769 15.2403231,9.46153846 13.7867966,11 C15.3252581,9.60737266 16.0944889,8.1458342 16.0944889,6.61538462 C16.0944889,5.08493503 15.3252581,3.54647349 13.7867966,2 Z"
              fill="#FFFFFF"
              style="mix-blend-mode: luminosity"
              transform="translate(18.286797, 6.500000) rotate(45.000000) translate(-18.286797, -6.500000) "
            )
              animate(
                attributeName="fill"
                values="#FFF06F;#FFF7AF;#FFFDF350;#FFF7AF"
                dur="4s"
                repeatCount="indefinite"
              )
            path#Rectangle-Copy-3(
              d="M60.7867966,55 C62.1794239,56.5384615 63.6409624,57.3076923 65.1714119,57.3076923 C66.7018615,57.3076923 68.2403231,56.5384615 69.7867966,55 C68.248335,56.6073727 67.4791043,58.1458342 67.4791043,59.6153846 C67.4791043,61.084935 68.248335,62.5464735 69.7867966,64 C68.1794239,62.4615385 66.6409624,61.6923077 65.1714119,61.6923077 C63.7018615,61.6923077 62.2403231,62.4615385 60.7867966,64 C62.3252581,62.6073727 63.0944889,61.1458342 63.0944889,59.6153846 C63.0944889,58.084935 62.3252581,56.5464735 60.7867966,55 Z"
              fill="#FFFFFF"
              style="mix-blend-mode: luminosity"
              transform="translate(65.286797, 59.500000) rotate(45.000000) translate(-65.286797, -59.500000) "
            )
              animate(
                attributeName="fill"
                values="#FFF06F;#FFF7AF;#FFFDF350;#FFF7AF"
                dur="6s"
                repeatCount="indefinite"
              )
            circle#Oval(stroke="#FFFFFF" cx="38" cy="16" r="2")
            path#Rectangle-Copy-5(
              d="M70.372583,45 C71.4557376,46.1965812 72.5924897,46.7948718 73.7828394,46.7948718 C74.9731891,46.7948718 76.1697703,46.1965812 77.372583,45 C76.1760018,46.2501787 75.5777112,47.4467599 75.5777112,48.5897436 C75.5777112,49.7327272 76.1760018,50.8694794 77.372583,52 C76.1224043,50.8034188 74.9258231,50.2051282 73.7828394,50.2051282 C72.6398558,50.2051282 71.5031036,50.8034188 70.372583,52 C71.5691642,50.9168454 72.1674548,49.7800933 72.1674548,48.5897436 C72.1674548,47.3993939 71.5691642,46.2028127 70.372583,45 Z"
              fill="#FFFFFF"
              style="mix-blend-mode: luminosity"
              transform="translate(73.872583, 48.500000) rotate(45.000000) translate(-73.872583, -48.500000) "
            )
              animate(
                attributeName="fill"
                values="#FFF06F;#FFF7AF;#FFFDF350;#FFF7AF"
                dur="2s"
                repeatCount="indefinite"
              )
            path#Combined-Shape(
              d="M0,13.5 L6,13.5 M3,10.5 L3,16.5"
              stroke="#FFFFFF"
              stroke-linecap="square"
            )
          g#astronaut(
            filter="url(#filter-15)"
            transform="translate(211.438727, 481.096310) scale(-1, 1) translate(-211.438727, -481.096310) translate(137.938727, 380.096310)"
          )
            g#leg(transform="translate(95.701959, 143.000000)")
              path#Triangle-Copy-4(
                d="M17.037236,4.40243572 C23.3351547,3.97446416 22.78972,13.2011906 27.6805712,29.4921021 C28.8804864,33.4888934 32.6316862,40.184447 38.9341705,49.5787627 L10.1039109,49.5623372 C6.11052395,20.0412048 8.42163232,4.98790427 17.037236,4.40243572 Z"
                fill="#C8DADE"
                transform="translate(23.570483, 26.983471) scale(1, -1) rotate(23.000000) translate(-23.570483, -26.983471) "
              )
              path#Triangle-Copy-4(
                d="M17.0489971,52.350339 L10.6704084,52.3467049 C7.69906856,26.9063354 8.69620736,12.3979704 13.6618248,8.82160975 C14.4121361,8.28121699 15.5411935,22.7907934 17.0489971,52.350339 Z"
                fill="#BBCFD4"
                transform="translate(13.025423, 30.578698) scale(1, -1) rotate(23.000000) translate(-13.025423, -30.578698) "
              )
              path#Combined-Shape-Copy(
                d="M13.7562153,35.0113612 C16.2628819,36.6851201 19.3962153,37.7312193 23.1562153,38.1496591 C26.9162153,38.5680988 30.2662254,38.7286914 33.2062456,38.6314371 C31.9900063,43.3099113 30.6401868,46.861322 29.1567873,49.2856691 C29.2581544,49.5033121 29.3101766,49.7320138 29.3101766,49.9701603 C29.3101766,52.2233646 24.6532221,54.468808 18.7695486,54.468808 C12.8858751,54.468808 8.11621528,52.642225 8.11621528,50.3890208 C8.11621528,48.4367619 11.6968588,46.804773 16.4803494,46.403652 C15.3135497,43.5232685 14.4054255,39.725593 13.7562153,35.0113612 Z"
                fill="#6484A7"
                transform="translate(20.661230, 44.740085) rotate(-25.000000) translate(-20.661230, -44.740085) "
              )
              path#Combined-Shape-Copy(
                d="M21.1378478,39.3247698 C19.1061405,38.9817081 16.5139582,38.0110154 13.3613009,36.4126917 C15.3589693,45.4110469 17.2396465,50.8060278 19.0033325,52.5976342 C20.3198684,53.9350119 21.6653554,39.4138415 21.1378478,39.3247698 Z"
                fill="#597696"
                transform="translate(17.308276, 44.548667) rotate(-25.000000) translate(-17.308276, -44.548667) "
              )
              path#Oval(
                d="M18.4289551,56.0761537 C22.5711208,56.8862093 23.9551553,53.9253387 23.9562407,52.0192417 C23.9573249,50.1131447 22.4139782,49.1712977 18.4328834,49.1735617 C14.4517885,49.175834 11.2235941,50.7228696 11.222509,52.6289666 C11.2214245,54.5350636 14.2867894,55.266098 18.4289551,56.0761537 Z"
                fill="#597696"
                transform="translate(17.589375, 52.693461) rotate(-23.000000) translate(-17.589375, -52.693461) "
              )
            g#leg(transform="translate(64.701959, 147.000000)")
              path#Triangle(
                d="M18.9860618,0.0146159014 C25.1602615,-0.420660049 24.6204146,8.88583319 29.4059136,25.3142189 C30.5799818,29.344738 34.2536136,36.0957928 40.4268092,45.5673835 L12.1640058,45.5673835 C8.26568804,15.7943328 10.5397067,0.610076916 18.9860618,0.0146159014 Z"
                fill="#C8DADE"
                transform="translate(25.372122, 22.783692) scale(1, -1) translate(-25.372122, -22.783692) "
              )
              path#Triangle(
                d="M19.859375,43.6291015 L12.1640058,43.6291015 C9.17966859,18.3126458 10.0635935,3.77637838 14.8157806,0.0202993069 C15.6266753,-0.620623403 17.3078734,13.915644 19.859375,43.6291015 Z"
                fill="#BBCFD4"
                transform="translate(15.148292, 21.814551) scale(1, -1) translate(-15.148292, -21.814551) "
              )
              polygon#Triangle(
                fill="#B5CACF"
                transform="translate(15.375000, 5.652152) scale(1, -1) translate(-15.375000, -5.652152) "
                points="19.859375 11.3043046 11.6933851 11.3043046 10.890625 4.27015755 14.4209488 1.81063375 18.8036991 -4.17237328e-13"
              )
              path#Combined-Shape(
                d="M8.328125,27.2151899 C10.890625,28.9029536 14.09375,29.9578059 17.9375,30.3797468 C21.78125,30.8016878 24.984375,31.0126582 27.546875,31.0126582 C26.5252772,35.6462 25.3185704,39.1723072 23.9267545,41.5909799 C24.1984515,41.9499114 24.34375,42.3293055 24.34375,42.721519 C24.34375,44.9935765 19.4678511,46.835443 13.453125,46.835443 C7.4383989,46.835443 2.5625,44.9935765 2.5625,42.721519 C2.5625,40.7529939 6.22264202,39.107396 11.1124223,38.7028459 C9.92015646,35.7983576 8.99179894,31.9688902 8.328125,27.2151899 Z"
                fill="#6484A7"
              )
              path#Combined-Shape(
                d="M3.96074604,29.1039291 C7.56279949,29.2025753 10.378108,28.969778 12.4066716,28.4055372 C12.749993,28.3100431 15.3850779,34.7220917 16.7184554,39.1583256 C17.857183,41.0589676 19.2858373,44.2951091 14.3868087,46.0181063 C9.45372818,47.7530796 7.20882919,48.1974266 6.06645078,46.3016373 C4.92407549,44.405846 6.78325796,41.2001922 10.2190472,39.1415992 C10.4768253,38.9871503 10.7259437,38.8450734 10.9667333,38.7151821 C8.93199608,36.3944404 6.59668065,33.1905311 3.96074604,29.1039291 Z"
                fill="#597696"
                transform="translate(10.895283, 37.969721) rotate(27.000000) translate(-10.895283, -37.969721) "
              )
            g#left-hand(
              transform="translate(71.451413, 96.324410) rotate(94.000000) translate(-71.451413, -96.324410) translate(52.451413, 68.324410)"
            )
              animateMotion(
                dur="1.5s"
                repeatCount="indefinite"
                path="M 0,0 -2,5 0,0"
              )
              path#Triangle(
                d="M27.5768899,1.25320085 C29.9445792,1.34701261 28.0786887,9.23003346 28.3578861,20.023327 C28.6370835,30.8166206 28.5313927,27.5887072 28.5257828,32.224851 C28.5220429,35.3156136 28.1881409,39.540305 27.5240768,44.8989252 C26.360059,48.9553615 24.6103712,50.798333 22.2750135,50.4278397 C18.7719769,49.8720997 16.4128507,49.388152 15.4375512,40.239364 C14.4622518,31.090576 15.5387538,24.1638993 16.3968102,17.3579739 C18.4667857,0.939357747 25.2092007,1.15938908 27.5768899,1.25320085 Z"
                fill="url(#radialGradient-16)"
                transform="translate(21.922636, 25.855584) rotate(-158.000000) translate(-21.922636, -25.855584) "
              )
              path#Path-4(
                d="M11.190895,31.1777408 C14.2783865,30.7518588 16.8123663,30.9752805 18.7928345,31.8480059 C20.7733026,32.7207314 22.4331222,34.3453754 23.7722932,36.7219382 L14.4024128,48.5871643 C14.654126,47.7838889 14.445087,48.8998404 13.7752957,51.9350185 C12.7706088,56.4877857 10.7255169,54.608284 9.47062018,53.9385892 C8.63402238,53.4921259 9.20801721,52.2401102 11.1926047,50.182542 C8.68077263,53.5096367 6.87536303,54.7615418 5.77637587,53.9382572 C4.67738871,53.1149727 5.0430815,51.5542436 6.87345423,49.2560699 C3.84961592,52.4359407 1.94459935,53.3816113 1.15840453,52.0930819 C0.372209711,50.8045525 1.60927656,48.5837831 4.86960507,45.4307737 C2.81346828,46.7385411 1.57618016,46.4996299 1.1577407,44.71404 C0.739301254,42.9284501 2.60388888,41.8476399 6.75150358,41.4716092 L11.190895,31.1777408 Z"
                fill="#6484A7"
                transform="translate(12.350787, 42.931871) rotate(-4.000000) translate(-12.350787, -42.931871) "
              )
            g#body(
              filter="url(#filter-17)"
              transform="translate(72.701959, 89.000000)"
            )
              path#Oval(
                d="M40.8376279,69.003267 C50.307072,66.4743834 57.9914848,66.6298062 58.0003372,41.2632584 C58.008852,15.8967106 49.4717341,1.3556297 27.0289408,0.0911878823 C4.58614749,-1.17325394 -0.013414991,24.1155824 0.000337213514,48.7721979 C0.0146546712,73.4288134 31.3681839,71.5321507 40.8376279,69.003267 Z"
                fill="url(#radialGradient-18)"
              )
              path#Combined-Shape(
                d="M0.000367899174,48.7720644 C-0.0133767036,24.1155165 4.5836433,-1.1732506 27.014031,0.0911877575 C44.6033748,1.0827284 53.6464277,10.238451 56.7264411,26.3763726 C53.1529483,15.4415398 45.4027254,9.25292209 31.98756,8.4941461 C12.3036333,7.38080233 8.26948972,29.6476779 8.28155138,51.3578816 C8.28986976,65.7393019 20.3596142,69.8612659 30.9217096,70.3580995 C18.0809633,70.9067295 0.0112333319,67.4941196 0.000367899174,48.7720644 Z"
                fill="#BBCFD4"
              )
              path#Path-3(
                d="M3.82451304,18.429584 L7.64868886,8.28672686 C14.0095914,12.533294 20.7527034,14.5154381 27.8780247,14.233159 C35.0033461,13.95088 42.1220752,11.9340154 49.234212,8.18256527 C50.1320922,8.67004226 51.0566025,9.86436176 52.0077429,11.7655237 C52.9588832,13.6666857 53.8941436,16.1017901 54.813524,19.0708369 C46.5798971,22.7120754 37.9755015,24.3896965 29.0003372,24.1037001 C20.0251729,23.8177038 11.6332315,21.9263317 3.82451304,18.429584 Z"
                fill="url(#radialGradient-19)"
              )
              polygon#Path-3(
                fill="#617AA7"
                points="3.82451304 18.429584 7.64868886 8.28672686 15.1536824 12.1801362 12.5856422 21.6105326"
              )
              path#Rectangle(
                d="M1.05488267,34.9117269 C11.5131837,36.6961184 21.3556079,37.5883142 30.5821554,37.5883142 C39.8087029,37.5883142 48.9480968,36.6961184 58.0003372,34.9117269 L58.0003372,44.2797824 C49.8283352,46.064174 40.6889412,46.9563697 30.5821554,46.9563697 C20.4753696,46.9563697 10.2814302,46.064174 0.000337213514,44.2797824 L1.05488267,34.9117269 Z"
                fill="url(#radialGradient-20)"
              )
              polygon#Rectangle(
                fill="#EEECEC"
                points="0.637699851 34.9117269 8.92341414 36.179584 8.2860515 45.6885126 0.000337213514 44.2797824"
              )
            g#head(
              filter="url(#filter-21)"
              transform="translate(99.821060, 67.419724) rotate(12.000000) translate(-99.821060, -67.419724) translate(59.821060, 31.419724)"
            )
              animateMotion(
                dur="1.5s"
                repeatCount="indefinite"
                path="M 0,0 -1,1 0,0"
              )
              path#Oval(
                d="M40.0285613,71.9452055 C61.787581,71.9452055 79.4267516,59.4072535 79.4267516,39.5401336 C79.4267516,19.6730137 61.787581,0 40.0285613,0 C18.2695417,0 0.630371044,19.6730137 0.630371044,39.5401336 C0.630371044,59.4072535 18.2695417,71.9452055 40.0285613,71.9452055 Z"
                fill="url(#radialGradient-22)"
              )
              path#Combined-Shape(
                d="M78.7910544,32.946768 C79.2086569,35.1243031 79.4267516,37.3310183 79.4267516,39.5401336 C79.4267516,59.4072535 61.787581,71.9452055 40.0285613,71.9452055 C25.018776,71.9452055 11.969422,65.9790178 5.31822395,55.7564286 C12.1982689,60.9673553 21.3073288,64.1799206 31.5185522,64.4378797 C53.6310099,64.9964915 78.2978009,51.6336955 78.7889255,33.0950961 Z"
                fill="#BBCFD4"
              )
              path#Combined-Shape(
                d="M13.4118997,10.6353782 C18.2133938,16.04024 22.4813885,19.8236432 26.2158839,21.9855879 C31.8176269,25.228505 32.4211988,32.2124714 27.8163819,43.8752781 C23.2915538,55.335494 19.2664732,61.6696939 10.6710592,62.4840409 C4.05297522,56.9024968 -1.77635684e-15,49.0633314 -1.77635684e-15,39.5401336 C-1.77635684e-15,29.43268 4.56553677,19.3754669 11.9163831,11.9334808 L13.4118997,10.6353782 Z"
                fill="url(#radialGradient-23)"
              )
              path#Combined-Shape(
                d="M13.4118997,10.6353782 C18.2133938,16.04024 22.4813885,19.8236432 26.2158839,21.9855879 C31.8176269,25.228505 32.4211988,32.2124714 27.8163819,43.8752781 C23.2915538,55.335494 19.2664732,61.6696939 10.6710592,62.4840409 C4.05297522,56.9024968 3.44613227e-13,49.0633314 3.44613227e-13,39.5401336 C3.44613227e-13,29.43268 4.56553677,19.3754669 11.9163831,11.9334808 L13.4118997,10.6353782 Z"
                fill="url(#radialGradient-24)"
                style="mix-blend-mode: darken"
              )
              path#Combined-Shape(
                d="M15.4370608,61.2848925 L15.3809481,61.3099201 C13.9709026,61.9263409 12.4150562,62.318811 10.6710592,62.4840409 C7.42392128,59.7454774 4.79429156,56.4634283 2.95790946,52.7056432 C7.11851755,58.0398088 11.2777892,60.8991495 15.4370608,61.2848925 Z"
                fill="#84C0D0"
              )
              path#Path-2(
                d="M8.82519462,21.8963669 C6.32423709,24.8641289 4.85337132,26.9494972 4.41259731,28.1524717 C3.9718233,29.3554462 3.34145226,32.6920355 2.52148418,38.1622394 C4.12669645,33.5727059 5.38743854,30.0275798 6.30371044,27.5268612 C7.21998235,25.0261426 8.06047707,23.1493112 8.82519462,21.8963669 Z"
                fill="url(#radialGradient-25)"
              )
            g#tool(
              transform="translate(38.201959, 71.500000) scale(-1, 1) translate(-38.201959, -71.500000) translate(0.701959, 0.000000)"
            )
              animateMotion(
                dur="1.5s"
                repeatCount="indefinite"
                path="M 0,0 -2,5 0,0"
              )
              path#Path-10(
                d="M18.9299296,7.38064516 L13.6274648,7.38064516 C10.7091549,8.08356375 9.25,10.0165899 9.25,13.1797235 C9.25,16.3428571 10.7091549,18.2758833 13.6274648,18.9788018 L41.1038732,18.9788018 C41.5151239,19.3441853 41.8364854,19.6956446 42.0679577,20.0331797 C42.2994301,20.3707148 42.4601108,20.7221741 42.55,21.0875576 L40.7,25.8322581"
                stroke="#A2B0CA"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              )
              g#Rectangle
                use(
                  fill="black"
                  fill-opacity="1"
                  filter="url(#filter-28)"
                  xlink:href="#path-27"
                )
                use(
                  fill="url(#radialGradient-26)"
                  fill-rule="evenodd"
                  xlink:href="#path-27"
                )
              path#Rectangle(
                d="M21.4391412,22.2509379 L22.0233527,22.2502292 C23.1279213,22.2488894 24.0244373,23.1432331 24.0257772,24.2478018 C24.025779,24.2493402 24.0257791,24.2508787 24.0257775,24.2524172 L23.8963518,142.48057 C23.8951446,143.583337 23.0015456,144.477041 21.898779,144.478379 L21.3145675,144.479088 C20.2099988,144.480427 19.3134828,143.586084 19.3121429,142.481515 C19.3121411,142.479977 19.312141,142.478438 19.3121427,142.4769 L19.4415684,24.248747 C19.4427756,23.1459802 20.3363745,22.2522755 21.4391412,22.2509379 Z"
                fill="#818B9D"
                transform="translate(21.668960, 83.364658) rotate(18.000000) translate(-21.668960, -83.364658) "
              )
            g#right-hand(
              filter="url(#filter-29)"
              transform="translate(85.430410, 124.337669) scale(1, -1) rotate(-108.000000) translate(-85.430410, -124.337669) translate(55.430410, 96.337669)"
            )
              animateMotion(
                dur="1.5s"
                repeatCount="indefinite"
                path="M 0,0 -2,5 0,0"
              )
              path#Path-5(
                d="M32.4140711,17.4934147 C35.4217862,20.9964951 39.1834897,28.2785547 36.0288347,38.8833627 C32.0796746,52.1590094 16.1745305,60.5325932 13.3498879,56.6735311 C10.5252453,52.8144691 19.5424522,44.2283824 22.0075939,38.0924501 C23.6510217,34.0018286 23.29241,30.067148 20.9317587,26.2884083 C19.3293534,24.4410787 19.1445711,22.0470062 20.3774119,19.1061909 C21.4334669,16.5870801 24.2212654,14.6215147 27.1947965,14.8584358 C29.4282252,15.036388 32.0891564,17.1149871 32.4140711,17.4934147 Z"
                fill="url(#radialGradient-30)"
                transform="translate(25.015267, 36.228342) scale(1, -1) rotate(-69.000000) translate(-25.015267, -36.228342) "
              )
              path#Combined-Shape(
                d="M39.3319903,19.7942644 C40.1736708,19.4453228 40.9821432,19.369616 41.7464523,19.6660115 C46.2049219,21.3949851 42.2308031,38.9257033 30.4284899,46.1777709 C21.0006051,51.9708435 12.993197,50.2231521 8.83123711,48.2251732 C6.83439129,47.2020409 5.62523707,46.0140914 5.20377445,44.6613246 C4.94786703,43.8399397 4.95880243,42.9094754 5.15534752,41.9908748 C9.22698468,45.1460151 14.5453877,46.9945787 19.8594884,46.9945787 C30.8322547,46.9945787 40.3074913,36.4461309 40.3074913,25.4512932 C40.3074913,23.4195865 39.9123783,21.550032 39.19894,19.8520778 Z"
                fill="#BFD5DB"
              )
              g#Group(
                transform="translate(37.388492, 23.012214) rotate(-7.000000) translate(-37.388492, -23.012214) translate(17.888492, 3.012214)"
              )
                path#Path-4(
                  d="M19.1503489,7.01084471 C22.6664635,5.73610122 25.652372,5.66170402 28.1080746,6.78765311 C30.5637771,7.9136022 32.7265934,10.3487096 34.5965234,14.0929753 C26.9870501,20.8490496 22.7747385,24.7860803 21.9595884,25.9040674 C20.7368634,27.581048 21.7344198,28.3194194 19.9211603,31.0071518 C18.1079007,33.6948843 17.0603362,34.2110853 15.1229412,34.1108135 C13.8313445,34.0439656 14.6492699,32.4819261 17.5767174,29.424695 C16.4831012,30.8523702 15.2821261,31.8645441 13.9737921,32.4612165 C12.0112912,33.3562252 9.57446468,34.8608072 9.14884272,33.8538456 C8.97867739,33.4512585 8.3226295,32.937078 9.09693185,31.7563589 C9.8712342,30.5756397 10.0421066,30.7593702 11.3455479,29.6166226 C12.2145087,28.8547908 12.9876905,28.323322 13.6650932,28.0222163 C11.8426098,29.1321302 10.5634336,29.8673678 9.82756453,30.227929 C9.79129404,30.2457008 10.7929338,29.9401814 12.8324837,29.3113709 C10.3372983,30.5052342 8.68447237,31.1098132 7.87400576,31.1251077 C6.65830585,31.1480494 6.13979697,31.2972553 5.43857009,30.9748941 C4.73734321,30.652533 4.58732617,28.9609711 5.59223303,28.5325971 C6.59713988,28.1042231 5.94371918,27.8693005 7.88966027,26.6660347 C9.18695433,25.8638575 10.3868907,24.9288746 11.4894694,23.8610858 C8.75559835,24.3152151 7.16197922,23.5708546 6.70861198,21.6280042 C6.25524474,19.6851537 8.43523055,18.9624528 13.2485694,19.4599015 C15.208735,17.329524 16.6404694,15.2190044 17.5437724,13.1283429 C18.4470754,11.0376813 18.9826009,8.99851527 19.1503489,7.01084471 Z"
                  fill="#6484A7"
                  transform="translate(19.736062, 20.091845) scale(1, -1) rotate(-64.000000) translate(-19.736062, -20.091845) "
                )
                path#Combined-Shape(
                  d="M25.8295441,7.74618186 C26.0232296,7.58561438 26.2052322,7.53317771 26.3755518,7.58887185 C26.4311459,7.607051 26.4870829,7.63064348 26.5433628,7.65964928 C27.7634823,8.28848015 27.6164173,11.0952463 26.1021678,16.0799477 C27.9536757,12.6671284 29.1677249,11.4818633 29.7443154,12.5241525 C30.6092011,14.0875862 29.8375117,14.8023985 28.3534965,17.3842708 C26.8694812,19.9661431 25.8579186,19.4373111 24.9688706,21.1238702 C24.3761719,22.2482428 22.8306773,27.3184344 20.3323868,36.3344448 C18.1988369,36.1335666 16.4032652,35.7719094 14.9456718,35.2494733 C17.9952835,31.9326318 20.7259427,27.6459578 22.4347187,22.5614062 C24.7119079,15.7855117 25.7883038,11.1155621 25.7640603,7.80501656 Z"
                  fill="#607EA0"
                )
            path#fist(
              d="M50.0069167,89 C51.791017,89 53.0334782,88.3939394 53.7343005,87.1818182 C54.3794065,85.3265605 54.7019595,83.811409 54.7019595,82.6363636 C54.7019595,79.6239014 52.6830671,79 50.0069167,79 C47.3307664,79 45.0107617,79 44.7219248,83.5454545 C44.4330878,88.0909091 47.3307664,89 50.0069167,89 Z"
              fill="#6484A7"
            )
              animateMotion(
                dur="1.5s"
                repeatCount="indefinite"
                path="M 0,0 -2,5 0,0"
              )
        //- 文字區塊
        g#text(transform="translate(521.236767, 478.096310)" fill="#404E67")
          foreignObject.foreignObject(width="100%" height="100%")
            body(xmlns="http://www.w3.org/1999/xhtml")
              p.title {{ svgMessage?.title }}
              p.subtitle {{ svgMessage?.subtitle }}
              p.subtitle
                span {{ svgMessage?.secondSubtitle.content }}
                span.time {{ svgMessage?.secondSubtitle.time }}
                span {{ svgMessage?.secondSubtitle.secondContent }}
</template>

<script lang="ts">
import { defineComponent, reactive, computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { maintain as maintainApi } from '@/api/system';
import { useRoute, useRouter } from 'vue-router';
import { codeMap } from '@/plugins/errorcode';
import type { SvgMessage } from './typings';

export default defineComponent({
  name: 'MaintenanceError',
  props: {
    svgMessage: { type: Object as PropType<SvgMessage> },
  },
  setup() {
    const { locale } = useI18n();
    const route = useRoute();
    const router = useRouter();

    const checkStatus = () => {
      if (route.query) {
        maintainApi
          .getFeatureMaintenanceStatus(route.query.name as string)
          .then(resp => {
            if (
              !resp.data.data.status &&
              +(route.query.code as string | number) === codeMap.featureMaintain
            ) {
              router.push(resp.data.data.route);
            }
          });
      }
    };
    // 檢查功能維護狀態
    checkStatus();

    const svg = reactive({
      height: 600,
      shortWidth: 740,
      longWidth: 780,
      viewBox: '65 175',
    });
    const width = computed(() => {
      if (locale.value === 'zh-tw' || locale.value === 'zh-cn') {
        return svg.shortWidth;
      }
      return svg.longWidth;
    });
    const viewBox = computed(() => {
      return `${svg.viewBox} ${width.value} ${svg.height}`;
    });

    return {
      svg,
      width,
      viewBox,
    };
  },
});
</script>

<style lang="scss" scoped>
svg {
  position: fixed;
  top: 25%;
}
p {
  width: 280px;
  height: 100%;
  margin: 0;
}
.title {
  margin-bottom: 8px;
  font-size: 32px;
  font-weight: 500;
}
.subtitle {
  font-size: 14px;
  font-weight: normal;
  line-height: 20px;
}
.time {
  font-weight: bold;
}
</style>
