<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        {{-- <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" /> --}}

        <link rel="shortcut icon" href="{{asset('images/favicon.ico')}}" />
        <!-- Bootstrap CSS -->
        <link rel="stylesheet" href="{{asset('css/bootstrap.min.css')}}">
        <!-- Typography CSS -->
        <link rel="stylesheet" href="{{asset('css/typography.css')}}">
        <!-- Style CSS -->
        <link rel="stylesheet" href="{{asset('css/style.css')}}">
        <!-- Responsive CSS -->
        <link rel="stylesheet" href="{{asset('css/responsive.css')}}">
        <!-- Full calendar -->
        <link href='{{asset('fullcalendar/core/main.css')}}' rel='stylesheet' />
        <link href='{{asset('fullcalendar/daygrid/main.css')}}' rel='stylesheet' />
        <link href='{{asset('fullcalendar/timegrid/main.css')}}' rel='stylesheet' />
        <link href='{{asset('fullcalendar/list/main.css')}}' rel='stylesheet' />
  
        <link rel="stylesheet" href="{{asset('css/flatpickr.min.css')}}">
        <!-- Scripts -->
        @routes
        {{-- @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"]) --}}
        @vite('resources/js/app.js')
        @vite(['resources/css/app.css'])
        @inertiaHead
    </head>
    <body >
        @inertia

      <script src="{{asset('js/jquery.min.js')}}"></script>
      <script src="{{asset('js/popper.min.js')}}"></script>
      <script src="{{asset('js/bootstrap.min.js')}}"></script>
      <!-- Appear JavaScript -->
      <script src="{{asset('js/jquery.appear.js')}}"></script>
      <!-- Countdown JavaScript -->
      <script src="{{asset('js/countdown.min.js')}}"></script>
      <!-- Counterup JavaScript -->
      <script src="{{asset('js/waypoints.min.js')}}"></script>
      <script src="{{asset('js/jquery.counterup.min.js')}}"></script>
      <!-- Wow JavaScript -->
      <script src="{{asset('js/wow.min.js')}}"></script>
      <!-- Apexcharts JavaScript -->
      <script src="{{asset('js/apexcharts.js')}}"></script>
      <!-- Slick JavaScript -->
      <script src="{{asset('js/slick.min.js')}}"></script>
      <!-- Select2 JavaScript -->
      <script src="{{asset('js/select2.min.js')}}"></script>
      <!-- Owl Carousel JavaScript -->
      <script src="{{asset('js/owl.carousel.min.js')}}"></script>
      <!-- Magnific Popup JavaScript -->
      <script src="{{asset('js/jquery.magnific-popup.min.js')}}"></script>
      <!-- Smooth Scrollbar JavaScript -->
      <script src="{{asset('js/smooth-scrollbar.js')}}"></script>
      <!-- lottie JavaScript -->
      <script src="{{asset('js/lottie.js')}}"></script>
      <!-- am core JavaScript -->
      <script src="{{asset('js/core.js')}}"></script>
      <!-- am charts JavaScript -->
      <script src="{{asset('js/charts.js')}}"></script>
      <!-- am animated JavaScript -->
      <script src="{{asset('js/animated.js')}}"></script>
      <!-- am kelly JavaScript -->
      <script src="{{asset('js/kelly.js')}}"></script>
      <!-- am maps JavaScript -->
      <script src="{{asset('js/maps.js')}}"></script>
      <!-- am worldLow JavaScript -->
      <script src="{{asset('js/worldLow.js')}}"></script>
      <!-- Raphael-min JavaScript -->
      <script src="{{asset('js/raphael-min.js')}}"></script>
      <!-- Morris JavaScript -->
      <script src="{{asset('js/morris.js')}}"></script>
      <!-- Morris min JavaScript -->
      <script src="{{asset('js/morris.min.js')}}"></script>
      <!-- Flatpicker Js -->
      <script src="{{asset('js/flatpickr.js')}}"></script>
      <!-- Style Customizer -->
      <script src="{{asset('js/style-customizer.js')}}"></script>
      <!-- Chart Custom JavaScript -->
      <script src="{{asset('js/chart-custom.js')}}"></script>
      <!-- Custom JavaScript -->
      <script src="{{asset('js/custom.js')}}"></script>
    </body>
</html>
