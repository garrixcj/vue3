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
      x1="0%"
      y1="21.9670112%"
      x2="59.5688036%"
      y2="95.6968%"
    )
      stop(stop-color="#D7EDF5" offset="0%")
      stop(stop-color="#84A2D4" offset="100%")
    filter#filter-2(
      x="-5.7%"
      y="-3.4%"
      filterUnits="objectBoundingBox"
      width="111.5%"
      height="106.7%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2.5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.874509804   0 0 0 0 0.996078431   0 0 0 0 1  0 0 0 0.7 0"
        in="shadowBlurOuter1"
        result="shadowMatrixOuter1"
      )
      feMerge
        feMergeNode(in="shadowMatrixOuter1")
        feMergeNode(in="SourceGraphic")
    linearGradient#linearGradient-3(
      x1="21.6726722%"
      y1="7.00465337%"
      x2="37.3054006%"
      y2="82.8540909%"
    )
      stop(stop-color="#E8FDFF" offset="0%")
      stop(
        stop-color="#C3FAFD"
        stop-opacity="0.735194493"
        offset="31.5800596%"
      )
      stop(stop-color="#C3FAFD" stop-opacity="0.33440778" offset="58.8479557%")
      stop(stop-color="#C3FAFD" stop-opacity="0" offset="100%")
    linearGradient#linearGradient-4(
      x1="50%"
      y1="26.3771387%"
      x2="50%"
      y2="112.375377%"
    )
      stop(stop-color="#FBFCFD" offset="0%")
      stop(stop-color="#C3CFE2" offset="100%")
    linearGradient#linearGradient-5(
      x1="50%"
      y1="-10.1843972%"
      x2="50%"
      y2="98.2163702%"
    )
      stop(stop-color="#FBFCFD" offset="0%")
      stop(stop-color="#C3CFE2" offset="100%")
    path#path-6(
      d="M24.9999998,131.096 L163,210.771 L163,288 L163,288 L163,271.229178 L148.25583,288 L163,288 L39.7441692,288 L24.9999998,271.23 L24.9999998,246 L19.9999998,246 L19.9999998,224 L24.9999998,224 L24.9999998,203.999 L19.9999998,204 L19.9999998,182 L24.9999998,181.999 L24.9999998,131.096 Z M148.25583,25 L163,41.7708216 L163,25 L163,25 L163,67 L168,67 L168,89 L163,89 L163,109 L168,109 L168,131 L163,131 L163,181.903 L24.9999998,102.228 L24.9999998,41.769 L39.7441692,25 L148.25583,25 Z"
    )
    filter#filter-7(
      x="-3.7%"
      y="-2.1%"
      filterUnits="objectBoundingBox"
      width="107.4%"
      height="104.2%"
    )
      feGaussianBlur(
        stdDeviation="5"
        in="SourceAlpha"
        result="shadowBlurInner1"
      )
      feOffset(dx="0" dy="1" in="shadowBlurInner1" result="shadowOffsetInner1")
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
        values="0 0 0 0 0.0198642789   0 0 0 0 0.153167851   0 0 0 0 0.228713768  0 0 0 0.124399038 0"
        in="shadowInnerInner1"
      )
    rect#path-8(x="24" y="0" rx="1.5" width="44" height="3")
    filter#filter-9(
      x="-22.7%"
      y="-266.7%"
      filterUnits="objectBoundingBox"
      width="145.5%"
      height="766.7%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="3"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.3 0"
        in="shadowBlurOuter1"
      )
    radialGradient#radialGradient-10(
      cx="50%"
      cy="0%"
      fx="50%"
      fy="0%"
      r="631.205816%"
      gradientTransform="translate(0.500000,0.000000),scale(0.032609,1.000000),rotate(90.000000),scale(1.000000,2.306488),translate(-0.500000,-0.000000)"
    )
      stop(stop-color="#EBFEFF" offset="0%")
      stop(stop-color="#C5FCFF" offset="100%")
    rect#path-11(x="0" y="0" rx="1.5" width="92" height="3")
    filter#filter-12(
      x="-19.0%"
      y="-516.7%"
      filterUnits="objectBoundingBox"
      width="138.0%"
      height="1266.7%"
    )
      feMorphology(
        radius="0.5"
        operator="dilate"
        in="SourceAlpha"
        result="shadowSpreadOuter1"
      )
      feOffset(
        dx="0"
        dy="2"
        in="shadowSpreadOuter1"
        result="shadowOffsetOuter1"
      )
      feGaussianBlur(
        stdDeviation="5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.5 0"
        in="shadowBlurOuter1"
      )
    rect#path-13(x="24" y="0" rx="1.5" width="44" height="3")
    filter#filter-14(
      x="-22.7%"
      y="-266.7%"
      filterUnits="objectBoundingBox"
      width="145.5%"
      height="766.7%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="3"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.3 0"
        in="shadowBlurOuter1"
      )
    rect#path-15(x="0" y="0" rx="1.5" width="92" height="3")
    filter#filter-16(
      x="-19.0%"
      y="-516.7%"
      filterUnits="objectBoundingBox"
      width="138.0%"
      height="1266.7%"
    )
      feMorphology(
        radius="0.5"
        operator="dilate"
        in="SourceAlpha"
        result="shadowSpreadOuter1"
      )
      feOffset(
        dx="0"
        dy="2"
        in="shadowSpreadOuter1"
        result="shadowOffsetOuter1"
      )
      feGaussianBlur(
        stdDeviation="5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.5 0"
        in="shadowBlurOuter1"
      )
    rect#path-17(x="24" y="0" rx="1.5" width="44" height="3")
    filter#filter-18(
      x="-22.7%"
      y="-400.0%"
      filterUnits="objectBoundingBox"
      width="145.5%"
      height="766.7%"
    )
      feOffset(dx="0" dy="-2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="3"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.3 0"
        in="shadowBlurOuter1"
      )
    rect#path-19(x="0" y="0" rx="1.5" width="92" height="3")
    filter#filter-20(
      x="-19.0%"
      y="-650.0%"
      filterUnits="objectBoundingBox"
      width="138.0%"
      height="1266.7%"
    )
      feMorphology(
        radius="0.5"
        operator="dilate"
        in="SourceAlpha"
        result="shadowSpreadOuter1"
      )
      feOffset(
        dx="0"
        dy="-2"
        in="shadowSpreadOuter1"
        result="shadowOffsetOuter1"
      )
      feGaussianBlur(
        stdDeviation="5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.5 0"
        in="shadowBlurOuter1"
      )
    rect#path-21(x="24" y="0" rx="1.5" width="44" height="3")
    filter#filter-22(
      x="-22.7%"
      y="-400.0%"
      filterUnits="objectBoundingBox"
      width="145.5%"
      height="766.7%"
    )
      feOffset(dx="0" dy="-2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="3"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.3 0"
        in="shadowBlurOuter1"
      )
    rect#path-23(x="0" y="0" rx="1.5" width="92" height="3")
    filter#filter-24(
      x="-19.0%"
      y="-650.0%"
      filterUnits="objectBoundingBox"
      width="138.0%"
      height="1266.7%"
    )
      feMorphology(
        radius="0.5"
        operator="dilate"
        in="SourceAlpha"
        result="shadowSpreadOuter1"
      )
      feOffset(
        dx="0"
        dy="-2"
        in="shadowSpreadOuter1"
        result="shadowOffsetOuter1"
      )
      feGaussianBlur(
        stdDeviation="5"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0   0 0 0 0 0.858719406   0 0 0 0 1  0 0 0 0.5 0"
        in="shadowBlurOuter1"
      )
    rect#path-25(x="0" y="0" rx="1" width="2" height="264")
    filter#filter-26(
      x="-350.0%"
      y="-1.9%"
      filterUnits="objectBoundingBox"
      width="800.0%"
      height="105.3%"
    )
      feOffset(dx="0" dy="2" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.0196078431   0 0 0 0 0.152941176   0 0 0 0 0.22745098  0 0 0 0.1 0"
        in="shadowBlurOuter1"
      )
    circle#path-27(cx="8.00000003" cy="4" r="2")
    filter#filter-28(
      x="-162.5%"
      y="-137.5%"
      filterUnits="objectBoundingBox"
      width="425.0%"
      height="425.0%"
    )
      feOffset(dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.0196078431   0 0 0 0 0.152941176   0 0 0 0 0.22745098  0 0 0 0.1 0"
        in="shadowBlurOuter1"
      )
    circle#path-29(cx="8.00000003" cy="18" r="2")
    filter#filter-30(
      x="-162.5%"
      y="-137.5%"
      filterUnits="objectBoundingBox"
      width="425.0%"
      height="425.0%"
    )
      feOffset(dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.0196078431   0 0 0 0 0.152941176   0 0 0 0 0.22745098  0 0 0 0.1 0"
        in="shadowBlurOuter1"
      )
    circle#path-31(cx="8.00000003" cy="32" r="2")
    filter#filter-32(
      x="-162.5%"
      y="-137.5%"
      filterUnits="objectBoundingBox"
      width="425.0%"
      height="425.0%"
    )
      feOffset(dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1")
      feGaussianBlur(
        stdDeviation="2"
        in="shadowOffsetOuter1"
        result="shadowBlurOuter1"
      )
      feColorMatrix(
        type="matrix"
        values="0 0 0 0 0.0196078431   0 0 0 0 0.152941176   0 0 0 0 0.22745098  0 0 0 0.1 0"
        in="shadowBlurOuter1"
      )
    filter#filter-33(
      x="-19.4%"
      y="-14.3%"
      filterUnits="objectBoundingBox"
      width="147.1%"
      height="124.8%"
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
    filter#filter-34(
      x="-16.7%"
      y="-13.6%"
      filterUnits="objectBoundingBox"
      width="133.4%"
      height="127.1%"
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
    radialGradient#radialGradient-35(
      cx="56.8365852%"
      cy="56.9577383%"
      fx="56.8365852%"
      fy="56.9577383%"
      r="52.2841556%"
      gradientTransform="translate(0.568366,0.569577),scale(1.000000,0.819820),rotate(90.000000),scale(1.000000,0.729196),translate(-0.568366,-0.569577)"
    )
      stop(stop-color="#D6EBF0" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    radialGradient#radialGradient-36(
      cx="50%"
      cy="94.3237002%"
      fx="50%"
      fy="94.3237002%"
      r="54.2617549%"
      gradientTransform="translate(0.500000,0.943237),scale(0.314554,1.000000),rotate(90.000000),scale(1.000000,1.770387),translate(-0.500000,-0.943237)"
    )
      stop(stop-color="#7B98CB" offset="0%")
      stop(stop-color="#6983B0" offset="100%")
    radialGradient#radialGradient-37(
      cx="51.134104%"
      cy="62.0899137%"
      fx="51.134104%"
      fy="62.0899137%"
      r="50%"
      gradientTransform="translate(0.511341,0.620899),scale(0.208791,1.000000),rotate(90.000000),scale(1.000000,4.705728),translate(-0.511341,-0.620899)"
    )
      stop(stop-color="#FFFCFC" offset="0%")
      stop(stop-color="#F3F3F3" offset="100%")
    filter#filter-38(
      x="-12.0%"
      y="-13.2%"
      filterUnits="objectBoundingBox"
      width="124.0%"
      height="126.4%"
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
    radialGradient#radialGradient-39(
      cx="55.5761828%"
      cy="16.5668909%"
      fx="55.5761828%"
      fy="16.5668909%"
      r="63.8986981%"
      gradientTransform="translate(0.555762,0.165669),scale(0.920000,1.000000),rotate(90.000000),scale(1.000000,1.268587),translate(-0.555762,-0.165669)"
    )
      stop(stop-color="#E6EFF1" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    radialGradient#radialGradient-40(
      cx="-11.1489204%"
      cy="28.5448845%"
      fx="-11.1489204%"
      fy="28.5448845%"
      r="161.52368%"
      gradientTransform="translate(-0.111489,0.285449),scale(1.000000,0.591237),rotate(107.147913),scale(1.000000,0.535690),translate(0.111489,-0.285449)"
    )
      stop(stop-color="#E3F9FF" offset="0%")
      stop(stop-color="#8BCCDD" offset="84.5181922%")
      stop(stop-color="#86C5D5" offset="100%")
    radialGradient#radialGradient-41(
      cx="20.0877469%"
      cy="47.5450127%"
      fx="20.0877469%"
      fy="47.5450127%"
      r="100.336821%"
      gradientTransform="translate(0.200877,0.475450),scale(1.000000,0.591237),rotate(-8.131792),scale(1.000000,1.113039),translate(-0.200877,-0.475450)"
    )
      stop(stop-color="#8BCCDD" stop-opacity="0" offset="0%")
      stop(
        stop-color="#8BCCDD"
        stop-opacity="0.511909965"
        offset="63.9375366%"
      )
      stop(stop-color="#2D535C" offset="100%")
    radialGradient#radialGradient-42(
      cx="37.9932274%"
      cy="42.9110015%"
      fx="37.9932274%"
      fy="42.9110015%"
      r="148.431396%"
      gradientTransform="translate(0.379932,0.429110),scale(1.000000,0.384615),rotate(90.000000),translate(-0.379932,-0.429110)"
    )
      stop(stop-color="#FFFFFF" stop-opacity="0.661412806" offset="0%")
      stop(stop-color="#FFFFFF" stop-opacity="0.189985795" offset="100%")
    filter#filter-43(
      x="-16.4%"
      y="-19.4%"
      filterUnits="objectBoundingBox"
      width="132.9%"
      height="138.7%"
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
    radialGradient#radialGradient-44(
      cx="50%"
      cy="39.4162077%"
      fx="50%"
      fy="39.4162077%"
      r="169.293537%"
      gradientTransform="translate(0.500000,0.394162),scale(1.000000,0.575654),rotate(97.242700),scale(1.000000,0.196729),translate(-0.500000,-0.394162)"
    )
      stop(stop-color="#E6EFF1" offset="0%")
      stop(stop-color="#C8DADE" offset="100%")
    radialGradient#radialGradient-45(
      cx="50%"
      cy="0%"
      fx="50%"
      fy="0%"
      r="131.25%"
      gradientTransform="translate(0.500000,0.000000),scale(1.000000,0.761905),rotate(90.000000),translate(-0.500000,-0.000000)"
    )
      stop(stop-color="#DAE1ED" offset="0%")
      stop(stop-color="#C6D0DC" offset="100%")
    radialGradient#radialGradient-46(
      cx="50%"
      cy="63.2260933%"
      fx="50%"
      fy="63.2260933%"
      r="63.7842315%"
      gradientTransform="translate(0.500000,0.632261),scale(1.000000,0.761905),scale(1.000000,1.169940),translate(-0.500000,-0.632261)"
    )
      stop(stop-color="#DAE1ED" stop-opacity="0" offset="0%")
      stop(stop-color="#6A6F75" offset="100%")
  g#Symbols(stroke="none" stroke-width="1" fill="none" fill-rule="evenodd")
    g#Permission
      g#image
        path#bg(
          d="M224.033984,4.71518092 C289.992865,21.4812169 454.217017,130.460451 491.907806,199.919743 C529.598595,269.379035 425.854323,288.590457 381.527638,346.023771 C337.200954,403.457085 364.028344,428.656377 291.338965,459.793301 C218.649586,490.930225 109.615517,489.732651 34.2339394,395.124305 C-41.1476387,300.515959 26.4638017,158.707749 61.1559316,87.3477869 C95.8480615,15.9878246 158.075103,-12.0508551 224.033984,4.71518092 Z"
          fill="url(#linearGradient-1)"
        )
        g#door(
          filter="url(#filter-2)"
          transform="translate(80.000000, 77.000000)"
        )
          path#shadow(
            d="M22,313.008568 L34,197 L167,313.008568 L235,370.003019 C201.521783,390.32963 166.188449,400.661957 129,401 C91.8115506,401.338044 53.8115506,391.672319 15,372.002824 L22,313.008568 Z"
            fill="url(#linearGradient-3)"
          )
          path#Combined-Shape(
            d="M188,190 L183,190 L183,265 L188,265 L188,190 Z M188,48 L183,48 L183,123 L188,123 L188,48 Z M188,313 L188,313 L188,293.040809 L167.91374,313 L20.0862598,313 L4.88498131e-13,293.040809 L3.01980663e-14,19.9591907 L20.0862598,1.24344979e-14 L167.91374,1.54543045e-13 L188,19.9591907 L188,313 Z"
            fill="url(#linearGradient-4)"
          )
          g#Combined-Shape
            use(
              fill="url(#linearGradient-5)"
              fill-rule="evenodd"
              xlink:href="#path-6"
            )
            use(
              fill="black"
              fill-opacity="1"
              filter="url(#filter-7)"
              xlink:href="#path-6"
            )
          g#light(transform="translate(48.000000, 25.000000)")
            g#core
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-9)"
                xlink:href="#path-8"
              )
              use(fill="#C5FCFF" fill-rule="evenodd" xlink:href="#path-8")
                animate(
                  attributeName="stop"
                  values="#EBFEFF;#ADF7FF;#CEFAFF;#ADF7FF;#EBFEFF;"
                  dur="5s"
                  repeatCount="indefinite"
                )
            g#outer-ring
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-12)"
                xlink:href="#path-11"
              )
              use(
                fill="url(#radialGradient-10)"
                fill-rule="evenodd"
                xlink:href="#path-11"
              )
                animate(
                  attributeName="fill"
                  values="#C5FCFF;#90F3FF;#C5FCFF"
                  dur="5s"
                  repeatCount="indefinite"
                )
          g#light(
            transform="translate(94.000000, 172.500000) rotate(30.000000) translate(-94.000000, -172.500000) translate(48.000000, 171.000000)"
          )
            g#core
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-14)"
                xlink:href="#path-13"
              )
              use(fill="#C5FCFF" fill-rule="evenodd" xlink:href="#path-13")
                animate(
                  attributeName="stop"
                  values="#EBFEFF;#ADF7FF;#CEFAFF;#ADF7FF;#EBFEFF;"
                  dur="5s"
                  repeatCount="indefinite"
                )
            g#outer-ring
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-16)"
                xlink:href="#path-15"
              )
              use(
                fill="url(#radialGradient-10)"
                fill-rule="evenodd"
                xlink:href="#path-15"
              )
                animate(
                  attributeName="fill"
                  values="#C5FCFF;#90F3FF;#C5FCFF"
                  dur="5s"
                  repeatCount="indefinite"
                )
          g#light(transform="translate(48.000000, 285.000000)")
            g#core
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-18)"
                xlink:href="#path-17"
              )
              use(fill="#C5FCFF" fill-rule="evenodd" xlink:href="#path-17")
                animate(
                  attributeName="stop"
                  values="#EBFEFF;#ADF7FF;#CEFAFF;#ADF7FF;#EBFEFF;"
                  dur="5s"
                  repeatCount="indefinite"
                )
            g#outer-ring
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-20)"
                xlink:href="#path-19"
              )
              use(
                fill="url(#radialGradient-10)"
                fill-rule="evenodd"
                xlink:href="#path-19"
              )
                animate(
                  attributeName="fill"
                  values="#C5FCFF;#90F3FF;#C5FCFF"
                  dur="5s"
                  repeatCount="indefinite"
                )
          g#light(
            transform="translate(94.000000, 140.500000) rotate(30.000000) translate(-94.000000, -140.500000) translate(48.000000, 139.000000)"
          )
            g#core
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-22)"
                xlink:href="#path-21"
              )
              use(fill="#C5FCFF" fill-rule="evenodd" xlink:href="#path-21")
                animate(
                  attributeName="stop"
                  values="#EBFEFF;#ADF7FF;#CEFAFF;#ADF7FF;#EBFEFF;"
                  dur="5s"
                  repeatCount="indefinite"
                )
            g#outer-ring
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-24)"
                xlink:href="#path-23"
              )
              use(
                fill="url(#radialGradient-10)"
                fill-rule="evenodd"
                xlink:href="#path-23"
              )
                animate(
                  attributeName="fill"
                  values="#C5FCFF;#90F3FF;#C5FCFF"
                  dur="5s"
                  repeatCount="indefinite"
                )
          g#hole(transform="translate(6.000000, 25.000000)")
            g#Rectangle-Copy-2(
              transform="translate(1.000000, 132.000000) scale(-1, 1) translate(-1.000000, -132.000000) "
            )
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-26)"
                xlink:href="#path-25"
              )
              use(fill="#CBD4DF" fill-rule="evenodd" xlink:href="#path-25")
            g#Oval
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-28)"
                xlink:href="#path-27"
              )
              use(fill="#CBD4DF" fill-rule="evenodd" xlink:href="#path-27")
            g#Oval-Copy
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-30)"
                xlink:href="#path-29"
              )
              use(fill="#CBD4DF" fill-rule="evenodd" xlink:href="#path-29")
            g#Oval-Copy-2
              use(
                fill="black"
                fill-opacity="1"
                filter="url(#filter-32)"
                xlink:href="#path-31"
              )
              use(fill="#CBD4DF" fill-rule="evenodd" xlink:href="#path-31")
        g#astronaut(
          filter="url(#filter-33)"
          transform="translate(284.701959, 249.000000)"
        )
          g#leg(transform="translate(51.593513, 139.061728)")
            path#Triangle-Copy-4(
              d="M21.5013045,5.54911062 C29.4403807,5.00571427 28.7462201,16.6238945 34.8996397,37.1330101 C36.4093117,42.1646902 41.1330402,50.5926737 49.0708252,62.4169607 L12.7291843,62.4169607 C7.71654418,25.2484312 10.6405843,6.29248121 21.5013045,5.54911062 Z"
              fill="#C8DADE"
              transform="translate(29.712801, 33.973912) scale(1, -1) rotate(23.000000) translate(-29.712801, -33.973912) "
            )
            path#Triangle-Copy-4(
              d="M21.4803513,65.9104684 L13.4399465,65.9104684 C9.71273141,33.8794791 10.9800635,15.6106245 17.2419429,11.1039048 C18.188121,10.4229335 19.6009238,28.6917881 21.4803513,65.9104684 Z"
              fill="#BBCFD4"
              transform="translate(16.417101, 38.498010) scale(1, -1) rotate(23.000000) translate(-16.417101, -38.498010) "
            )
            path#Combined-Shape-Copy(
              d="M17.3443219,44.0737286 C20.5048157,46.1807245 24.455433,47.4975969 29.1961737,48.0243459 C33.9369145,48.5510948 38.1607255,48.7532554 41.8676068,48.6308277 C40.334292,54.5196566 38.6325905,58.9899933 36.7625023,62.0418375 C36.8895756,62.31618 36.9553054,62.6043701 36.9553054,62.9044747 C36.9553054,65.7409 31.0836528,68.5675557 23.6653095,68.5675557 C16.2469662,68.5675557 10.2332107,66.2681787 10.2332107,63.4317533 C10.2332107,60.9740645 14.7482011,58.9195792 20.779785,58.4147434 C19.3077147,54.7882407 18.1628157,50.0078086 17.3443219,44.0737286 Z"
              fill="#6484A7"
              transform="translate(26.050409, 56.320642) rotate(-25.000000) translate(-26.050409, -56.320642) "
            )
            path#Combined-Shape-Copy(
              d="M26.6513448,49.5036231 C24.0896965,49.0717631 20.8213815,47.8498155 16.8463999,45.8377805 C19.3651307,57.1652769 21.7363549,63.9566987 23.9600725,66.2120459 C25.6200075,67.8955915 27.3164449,49.6157502 26.6513448,49.5036231 Z"
              fill="#597696"
              transform="translate(21.822886, 56.079678) rotate(-25.000000) translate(-21.822886, -56.079678) "
            )
            path#Oval(
              d="M23.2384931,70.5925977 C28.4604016,71.6155469 30.2028958,67.8883735 30.2028958,65.4883213 C30.2028958,63.088269 28.2567842,61.9012397 23.2384931,61.9012397 C18.220202,61.9012397 14.1520733,63.8468664 14.1520733,66.2469187 C14.1520733,68.6469709 18.0165846,69.5696485 23.2384931,70.5925977 Z"
              fill="#597696"
              transform="translate(22.177485, 66.333779) rotate(-23.000000) translate(-22.177485, -66.333779) "
            )
          g#leg(transform="translate(12.087341, 144.592593)")
            path#Triangle(
              d="M23.4167145,0.0182464191 C31.0317468,-0.525149927 30.3659193,11.0930303 36.2681789,31.6021459 C37.7162316,36.633826 42.2471549,45.0618095 49.8609487,56.8860965 L15.00264,56.8860965 C10.1945975,19.717567 12.999289,0.761617009 23.4167145,0.0182464191 Z"
              fill="#C8DADE"
              transform="translate(31.293047, 28.443048) scale(1, -1) translate(-31.293047, -28.443048) "
            )
            path#Triangle(
              d="M24.4938272,54.4663548 L15.00264,54.4663548 C11.3218677,22.8614165 12.4120684,4.71441212 18.2732422,0.0253415545 C19.2733701,-0.774783192 21.3468984,17.3722212 24.4938272,54.4663548 Z"
              fill="#BBCFD4"
              transform="translate(18.683350, 27.233177) scale(1, -1) translate(-18.683350, -27.233177) "
            )
            polygon#Triangle(
              fill="#B5CACF"
              transform="translate(18.993827, 7.056119) scale(1, -1) translate(-18.993827, -7.056119) "
              points="24.4938272 14.1122381 14.4783971 14.1122381 13.4938272 5.3308436 17.8237016 2.26038624 23.1990609 -5.27368398e-13"
            )
            path#Combined-Shape(
              d="M10.2716049,33.9753086 C13.4320988,36.0823045 17.382716,37.399177 22.1234568,37.9259259 C26.8641975,38.4526749 30.8148148,38.7160494 33.9753086,38.7160494 C32.7152739,44.5006932 31.2269204,48.902748 29.510248,51.9222138 C29.8455166,52.3701445 30.0246914,52.8437385 30.0246914,53.3333333 C30.0246914,56.1697587 24.0109359,58.4691358 16.5925926,58.4691358 C9.17424929,58.4691358 3.16049383,56.1697587 3.16049383,53.3333333 C3.16049383,50.8756445 7.67548415,48.8211593 13.7070681,48.3163235 C12.2349978,44.6898227 11.0900987,39.9093887 10.2716049,33.9753086 Z"
              fill="#6484A7"
            )
            path#Combined-Shape(
              d="M4.82070555,36.3212647 C9.27358512,36.4648879 12.7521018,36.1910988 15.2562555,35.4998976 C15.6800001,35.3829348 18.9730281,43.3830957 20.6469375,48.9169397 C22.0651682,51.2914304 23.8524853,55.3326879 17.8052071,57.451455 C11.7176675,59.5843284 8.94542091,60.1249315 7.52247234,57.7567474 C6.09952377,55.3885633 8.37910777,51.4059491 12.6140657,48.8613296 C12.9320489,48.6702661 13.2393831,48.4945885 13.5364771,48.334066 C11.0079304,45.4325035 8.10268425,41.4276426 4.82070555,36.3212647 Z"
              fill="#597696"
              transform="translate(13.430307, 47.402699) rotate(27.000000) translate(-13.430307, -47.402699) "
            )
          g#hand(
            transform="translate(24.888889, 117.212570) rotate(1.000000) translate(-24.888889, -117.212570) translate(0.790123, 81.657014)"
          )
            path#Triangle(
              d="M35.7097873,1.5558324 C38.6749108,1.67108099 36.331254,11.5308508 36.671483,25.0281989 C37.011712,38.525547 36.8821683,34.4889607 36.8710932,40.2867119 C36.8637099,44.1518794 36.4418535,49.435374 35.605524,56.1371959 C34.1442086,61.2110035 31.9513554,63.5172664 29.0269645,63.0559844 C24.6403781,62.3640615 21.6863195,61.7609195 20.472882,50.3207217 C19.2594444,38.8805239 20.6136653,30.2174033 21.6942076,21.7054794 C24.3009081,1.17131195 32.7446639,1.44058381 35.7097873,1.5558324 Z"
              fill="#C8DADE"
              transform="translate(28.613194, 32.324789) rotate(-158.000000) translate(-28.613194, -32.324789) "
            )
            path#Path-4(
              d="M15.2391345,39.0529867 C19.1069551,38.5202052 22.2813055,38.7992408 24.7621858,39.8900935 C27.2430661,40.9809461 29.3221777,43.0118781 30.9995206,45.9828893 L19.2603157,60.8177626 C19.5757333,59.8134852 19.3137395,61.2086632 18.4743343,65.0032964 C17.2152265,70.6952462 15.3304085,70.8630437 13.7584456,70.025937 C12.7104704,69.4678658 13.2040333,67.0634378 15.2391345,62.8126529 C11.2414128,68.5636486 8.55423492,70.9245759 7.17760085,69.8954349 C5.80096679,68.8662939 6.68461264,66.1194387 9.82853842,61.6548693 C4.53147212,66.6775099 1.39056928,68.3834192 0.405829908,66.7725973 C-0.578909466,65.1617754 1.72538088,61.8618217 7.31870095,56.8727364 C4.17404508,59.4596728 2.33972334,59.6369987 1.81573571,57.404714 C1.29174808,55.1724293 3.91205127,53.3451266 9.67664528,51.9228059 L15.2391345,39.0529867 Z"
              fill="#6484A7"
            )
          g#body(
            filter="url(#filter-34)"
            transform="translate(23.148651, 72.634453)"
          )
            path#Oval(
              d="M50.625446,86.0051153 C62.3644928,82.8531351 71.8906785,83.0468529 71.9016526,51.4301924 C71.9122082,19.8135319 61.3289441,1.68964592 33.5071416,0.113655841 C5.68533908,-1.46233424 -0.0166302485,30.0574674 0.000418035655,60.789274 C0.0181670508,91.5210806 38.8863991,89.1570954 50.625446,86.0051153 Z"
              fill="url(#radialGradient-35)"
            )
            path#Combined-Shape(
              d="M0.000456075944,60.7891075 C-0.0165827845,30.0573852 5.68223469,-1.46233008 33.4886583,0.113655685 C55.2916353,1.34938387 66.5020351,12.7589055 70.3213205,32.8694359 C65.8896291,19.2439392 56.282241,11.5326282 39.6542251,10.5870352 C15.2525246,9.19937247 10.2514917,36.9526265 10.2664443,64.0120492 C10.276757,81.9380026 25.241116,87.0751299 38.3352541,87.6938781 C22.4166989,88.3779846 0.0139263448,84.1252482 0.000456075944,60.7891075 Z"
              fill="#BBCFD4"
            )
            path#Path-3(
              d="M4.74115878,22.9704848 L9.48189952,10.3285095 C17.3673607,15.6213965 25.7266378,18.0919249 34.559731,17.7400946 C43.3928241,17.3882642 52.217745,14.8744605 61.0344936,10.1986833 C62.1475745,10.8062707 63.2936681,12.2948609 64.4727745,14.6644539 C65.6518808,17.0340468 66.8113011,20.0691413 67.9510353,23.7697372 C57.7440019,28.3081475 47.0773352,30.3991209 35.9510353,30.0426574 C24.8247354,29.6861938 14.4214432,27.328803 4.74115878,22.9704848 Z"
              fill="url(#radialGradient-36)"
            )
            polygon#Path-3(
              fill="#617AA7"
              points="4.74115878 22.9704848 9.48189952 10.3285095 18.7856633 15.1812235 15.6021243 26.9351935"
            )
            path#Rectangle(
              d="M1.30771321,43.5136947 C14.2726227,45.7377459 26.4740444,46.8497715 37.9119781,46.8497715 C49.3499118,46.8497715 60.6798033,45.7377459 71.9016526,43.5136947 L71.9016526,55.1899635 C61.7710141,57.4140148 50.4411225,58.5260404 37.9119781,58.5260404 C25.3828336,58.5260404 12.7456469,57.4140148 0.000418035655,55.1899635 L1.30771321,43.5136947 Z"
              fill="url(#radialGradient-37)"
            )
            polygon#Rectangle(
              fill="#EEECEC"
              points="0.790541492 43.5136947 11.0621464 45.0939416 10.272023 56.9457935 0.000418035655 55.1899635"
            )
          g#head(
            filter="url(#filter-38)"
            transform="translate(7.346600, 0.000000)"
          )
            path#Oval(
              d="M50.1728395,90.8641975 C77.4461605,90.8641975 99.5555556,75.0292168 99.5555556,49.9377615 C99.5555556,24.8463062 77.4461605,0 50.1728395,0 C22.8995185,0 0.790123457,24.8463062 0.790123457,49.9377615 C0.790123457,75.0292168 22.8995185,90.8641975 50.1728395,90.8641975 Z"
              fill="url(#radialGradient-39)"
            )
            path#Combined-Shape(
              d="M98.7594041,41.6139838 C99.2824156,44.3630273 99.5555556,47.1488801 99.5555556,49.9377615 C99.5555556,75.0292168 77.4461605,90.8641975 50.1728395,90.8641975 C31.3591357,90.8641975 15.0027001,83.3290789 6.66593549,70.4182566 C15.2891285,76.9993918 26.7068803,81.0569159 39.5061728,81.382716 C67.2225022,82.0882226 98.1404994,65.2114936 98.7560877,41.7979117 Z"
              fill="#BBCFD4"
            )
            path#Combined-Shape(
              d="M16.8108238,13.4320988 C22.8291413,20.2582441 28.1787568,25.0365458 32.8596704,27.7670039 C39.8810409,31.8626911 40.6375735,40.6831886 34.8657763,55.4128925 C29.1940193,69.8872923 24.1487074,77.8872173 13.3741307,78.9152077 C5.08000163,71.8655989 1.68424945e-14,61.9650948 1.68424945e-14,49.9377615 C1.68424945e-14,37.1717515 5.72315505,24.4692 14.9377356,15.0700957 L16.8108238,13.4320988 Z"
              fill="url(#radialGradient-40)"
            )
            path#Combined-Shape(
              d="M16.8108238,13.4320988 C22.8291413,20.2582441 28.1787568,25.0365458 32.8596704,27.7670039 C39.8810409,31.8626911 40.6375735,40.6831886 34.8657763,55.4128925 C29.1940193,69.8872923 24.1487074,77.8872173 13.3741307,78.9152077 C5.08000163,71.8655989 -4.61852778e-14,61.9650948 -4.61852778e-14,49.9377615 C-4.61852778e-14,37.1717515 5.72315505,24.4692 14.9377356,15.0700957 L16.8108238,13.4320988 Z"
              fill="url(#radialGradient-41)"
              style="mix-blend-mode: darken"
              opacity="0.598905342"
            )
            path#Combined-Shape(
              d="M19.3500436,77.4006846 L19.2022106,77.4657609 C17.4547908,78.2251341 15.529046,78.7096096 13.3741307,78.9152077 C9.30352827,75.4553924 6.00710042,71.3088929 3.70541689,66.5613029 C8.92032148,73.300816 14.1351826,76.9136947 19.3500436,77.4006846 Z"
              fill="#72A7B5"
            )
            path#Path-2(
              d="M11.0617284,27.654321 C7.9269632,31.4024973 6.0833418,34.0362422 5.5308642,35.5555556 C4.9783866,37.074869 4.18826314,41.2888607 3.16049383,48.1975309 C5.17250863,42.4011157 6.75275554,37.9237494 7.90123457,34.7654321 C9.0497136,31.6071148 10.1032115,29.2367444 11.0617284,27.654321 Z"
              fill="url(#radialGradient-42)"
            )
          g#left-hand(
            filter="url(#filter-43)"
            transform="translate(72.802433, 64.818362) rotate(-48.000000) translate(-72.802433, -64.818362) translate(36.302433, 33.818362)"
          )
            path#Path-5(
              d="M34.3462341,13.072709 C37.2797909,14.0904681 39.0624065,14.9678571 39.6940807,15.7048758 C43.4562605,20.0944754 48.1629894,29.2181705 44.2240395,42.5006935 C39.2930585,59.1284422 19.4114582,69.6097612 15.8779932,64.7743323 C12.3445281,59.9389034 23.6142436,49.1880068 26.6933156,41.5030657 C28.7460303,36.3797716 28.2957321,31.450832 25.3424209,26.7162468 C23.3380726,24.4014082 23.1058664,21.4023912 24.6458025,17.7191958 C26.1857386,14.0360004 29.4192158,12.4871715 34.3462341,13.072709 Z"
              fill="url(#radialGradient-44)"
              transform="translate(30.456132, 39.455176) scale(1, -1) rotate(-75.000000) translate(-30.456132, -39.455176) "
            )
            path#Combined-Shape(
              d="M48.0216835,19.0204131 C49.1095877,18.5507603 50.1538365,18.439243 51.1394589,18.8206954 C56.7246526,20.9822595 51.7462127,42.8991756 36.9612726,51.9657156 C25.1508158,59.208219 15.1198121,57.0232539 9.9060606,54.5253793 C9.03066591,54.1059834 7.72179844,52.611194 5.97945818,50.0410111 C5.47854582,48.7872047 5.16275085,47.6136236 5.03207325,46.5202677 C10.167112,50.5936816 16.9470072,52.9868892 23.7213213,52.9868892 C37.4670751,52.9868892 49.3368503,39.7992124 49.3368503,26.0534587 C49.3368503,23.5136909 48.8419927,21.1766023 47.9484394,19.054001 Z"
              fill="#BFD5DB"
            )
            g#Group(
              transform="translate(48.453783, 25.102576) rotate(4.000000) translate(-48.453783, -25.102576) translate(25.953783, 2.102576)"
            )
              path#Path-4(
                d="M22.1625154,6.92347935 C26.6745787,6.82907614 30.304216,7.33684727 33.0514275,8.44679273 C35.7986389,9.55673819 38.1018721,11.7655682 39.9611272,15.0732828 C31.2020272,22.8274328 26.3535051,27.3462846 25.415561,28.6298383 C24.0086448,30.5551688 25.1583829,31.4042934 23.0721562,34.4901955 C20.9859296,37.5760975 20.6064909,38.8367225 18.374747,38.7197618 C16.8869177,38.6417879 17.5520677,36.6252629 20.3701969,32.6701866 C19.111773,34.3092431 17.7293074,35.4708898 16.2228004,36.1551266 C13.9630398,37.1814818 11.157464,38.9076568 10.6662842,37.7505098 C10.1751044,36.5933627 11.6549896,35.2742272 13.1553658,33.9626763 C14.1556167,33.0883089 15.0582249,32.1192488 15.8631907,31.0554958 C14.7364337,32.262811 13.2636386,33.1062526 11.4448052,33.5858206 C8.71655505,34.3051727 6.37113134,34.1422548 5.56310752,33.7712974 C4.7550837,33.4003401 4.58074795,31.4570033 5.73789501,30.9658235 C6.89504208,30.4746437 6.96893005,30.8727681 9.20933621,29.4922842 C10.7029403,28.5719615 12.0842793,27.4989877 13.3533532,26.2733628 C10.4765494,27.5742859 8.69322371,27.2150811 8.00337624,25.1957484 C7.31352878,23.1764157 9.77095033,21.8508547 15.3756409,21.2190653 C17.6315915,18.7735649 19.2788689,16.3503932 20.3174731,13.9495501 C21.3560773,11.548707 21.9710914,9.2066834 22.1625154,6.92347935 Z"
                fill="#6484A7"
                transform="translate(22.437345, 22.819778) scale(1, -1) rotate(-64.000000) translate(-22.437345, -22.819778) "
              )
              path#Combined-Shape(
                d="M30.02657,6.2387189 C30.2753975,6.02713058 30.5089169,5.95694208 30.7271281,6.02815341 C30.7967716,6.05088099 30.8668448,6.08037633 30.9373475,6.1166394 C32.4658099,6.90280419 32.2815794,10.4118252 30.3846557,16.6437024 C32.7040682,12.3769933 34.2249263,10.8951741 34.9472302,12.1982447 C36.0306859,14.1528506 35.0639787,15.0465095 33.2049298,18.274368 C31.345881,21.5022265 30.0786809,20.8410804 28.9649567,22.9496177 C28.2224739,24.3553092 26.286409,30.6940662 23.1567619,41.9658888 C20.678184,41.8833246 18.5397226,41.3093205 16.7413776,40.2438763 C20.4274169,36.1493864 23.7121899,30.9181991 25.7903867,24.7468203 C28.6430489,16.2756018 29.991463,10.4372285 29.9610915,6.29837849 Z"
                fill="#607EA0"
              )
            animateMotion(
              path="M 0,0 -2,3 -2,5 -2,3 Z"
              dur="10s"
              repeatCount="indefinite"
            )
        path#Shape(
          d="M174.142857,151.571429 C175.4,151.571429 176.428571,152.6 176.428571,153.857143 C176.428571,154.828263 175.814794,155.662988 174.956007,155.992549 L176.428571,159.571429 L171.857143,159.571429 L173.329707,155.992549 C172.470921,155.662988 171.857143,154.828263 171.857143,153.857143 C171.857143,152.6 172.885714,151.571429 174.142857,151.571429 Z M179.857143,147 L179.857143,144.714286 C179.857143,141.56 177.297143,139 174.142857,139 C170.988571,139 168.428571,141.56 168.428571,144.714286 L168.428571,147 L167.285714,147 C166.028571,147 165,148.028571 165,149.285714 L165,160.714286 C165,161.971429 166.028571,163 167.285714,163 L181,163 C182.257143,163 183.285714,161.971429 183.285714,160.714286 L183.285714,149.285714 C183.285714,148.028571 182.257143,147 181,147 L179.857143,147 Z M177.685714,147 L170.6,147 L170.6,144.714286 C170.6,142.76 172.188571,141.171429 174.142857,141.171429 C176.097143,141.171429 177.685714,142.76 177.685714,144.714286 L177.685714,147 L177.685714,147 Z"
          fill="url(#radialGradient-45)"
        )
        path#Shape(
          d="M174.142857,151.571429 C175.4,151.571429 176.428571,152.6 176.428571,153.857143 C176.428571,154.828263 175.814794,155.662988 174.956007,155.992549 L176.428571,159.571429 L171.857143,159.571429 L173.329707,155.992549 C172.470921,155.662988 171.857143,154.828263 171.857143,153.857143 C171.857143,152.6 172.885714,151.571429 174.142857,151.571429 Z M179.857143,147 L179.857143,144.714286 C179.857143,141.56 177.297143,139 174.142857,139 C170.988571,139 168.428571,141.56 168.428571,144.714286 L168.428571,147 L167.285714,147 C166.028571,147 165,148.028571 165,149.285714 L165,160.714286 C165,161.971429 166.028571,163 167.285714,163 L181,163 C182.257143,163 183.285714,161.971429 183.285714,160.714286 L183.285714,149.285714 C183.285714,148.028571 182.257143,147 181,147 L179.857143,147 Z M177.685714,147 L170.6,147 L170.6,144.714286 C170.6,142.76 172.188571,141.171429 174.142857,141.171429 C176.097143,141.171429 177.685714,142.76 177.685714,144.714286 L177.685714,147 L177.685714,147 Z"
          fill="url(#radialGradient-46)"
          style="mix-blend-mode: darken"
          opacity="0.180436955"
        )
      //- 文字區塊
      g#text(transform="translate(420.000000, 335.000000)" fill="#404E67")
        foreignObject.foreignObject(width="100%" height="100%")
          body(xmlns="http://www.w3.org/1999/xhtml")
            p.title {{ svgMessage?.title }}
            p.subtitle {{ svgMessage?.subtitle }}
</template>

<script lang="ts">
import { defineComponent, reactive, computed, type PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import type { SvgMessage } from './typings';

export default defineComponent({
  name: 'ForbiddenError',
  props: {
    svgMessage: { type: Object as PropType<SvgMessage> },
  },
  setup() {
    const { locale } = useI18n();

    const svg = reactive({
      height: 489,
      shortWidth: 620,
      longWidth: 740,
      viewBox: '0 0',
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
  width: 322px;
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
</style>
