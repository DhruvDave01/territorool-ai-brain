@extends('mails.layoutroute')
@section('body')
<tr>
	<td colspan="2">Dear Admin,</td>
</tr>
@php
$dt = \Carbon\Carbon::now();
@endphp

<tr>
	<td>Free Package User {{$userdata->name}} with email {{$userdata->email}} has been converted to a customer on {{$dt->format('d/m/Y')}}</td>
</tr>
<tr>
	<td>Package: {{ $package->title }}</td>
</tr>
<tr>
	<td>Amount: ${{ $subscription->amount - $discount }}</td>
</tr>
  
@endsection